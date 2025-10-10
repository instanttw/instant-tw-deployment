import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { compare } from "bcryptjs";
import { sql } from '@vercel/postgres';

// Custom WordPress.com OAuth Provider
const WordPressProvider = {
  id: "wordpress",
  name: "WordPress",
  type: "oauth" as const,
  authorization: {
    url: "https://public-api.wordpress.com/oauth2/authorize",
    params: {
      scope: "auth",
      response_type: "code",
    },
  },
  token: "https://public-api.wordpress.com/oauth2/token",
  userinfo: "https://public-api.wordpress.com/rest/v1/me",
  clientId: process.env.WORDPRESS_CLIENT_ID,
  clientSecret: process.env.WORDPRESS_CLIENT_SECRET,
  profile(profile: any) {
    return {
      id: profile.ID.toString(),
      name: profile.display_name || profile.username,
      email: profile.email,
      image: profile.avatar_URL,
    };
  },
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Get user from unified users table
        const result = await sql`
          SELECT id, email, name, password_hash, role 
          FROM users 
          WHERE email = ${credentials.email}
          LIMIT 1
        `;

        if (result.rows.length === 0) {
          throw new Error("Invalid credentials");
        }

        const user = result.rows[0];

        if (!user.password_hash) {
          throw new Error("Invalid credentials");
        }

        // Verify password with bcrypt
        const isValid = await compare(credentials.password, user.password_hash);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || undefined,
          role: user.role || 'user',
        };
      },
    }),
    WordPressProvider,
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log('🔐 signIn callback triggered', {
          provider: account?.provider,
          email: user.email,
          name: user.name,
          accountData: account ? { provider: account.provider, type: account.type } : null,
        });

        // For credentials provider, always allow
        if (account?.provider === "credentials") {
          console.log('✅ Credentials login approved');
          return true;
        }

        // For OAuth providers (WordPress, GitHub), check if user exists or create new user
        if (account?.provider === "wordpress" || account?.provider === "github") {
          const email = user.email;
          if (!email) {
            console.error("❌ No email provided by OAuth provider");
            return false;
          }

          console.log(`🔍 Checking if user exists: ${email}`);

          try {
            // Check if user exists
            const existingUser = await sql`
              SELECT id, email, name, role 
              FROM users 
              WHERE email = ${email}
              LIMIT 1
            `;

            if (existingUser.rows.length > 0) {
              // User exists, update their info if needed
              const dbUser = existingUser.rows[0];
              user.id = dbUser.id;
              user.role = dbUser.role || 'user';
              
              console.log(`✅ Existing OAuth user found:`, {
                id: dbUser.id,
                email: dbUser.email,
                role: dbUser.role,
              });

              // Update name and avatar if changed
              try {
                await sql`
                  UPDATE users 
                  SET name = ${user.name || dbUser.name},
                      updated_at = NOW()
                  WHERE id = ${dbUser.id}
                `;
                console.log('✅ User info updated');
              } catch (updateError) {
                console.error('⚠️ Failed to update user info, but continuing:', updateError);
              }
              
              console.log('✅ Allowing sign in for existing user');
              return true;
            }

            // User doesn't exist, create new user
            console.log(`📝 Creating new user for: ${email}`);
            const newUser = await sql`
              INSERT INTO users (email, name, role, created_at, updated_at)
              VALUES (
                ${email},
                ${user.name || email.split('@')[0]},
                'user',
                NOW(),
                NOW()
              )
              RETURNING id, email, name, role
            `;

            if (newUser.rows.length > 0) {
              const createdUser = newUser.rows[0];
              user.id = createdUser.id;
              user.role = createdUser.role;
              console.log('✅ New OAuth user created:', {
                id: createdUser.id,
                email: email,
                name: createdUser.name,
                role: createdUser.role,
                provider: account?.provider,
              });
              return true;
            }

            console.error('❌ Failed to create OAuth user - no rows returned');
            return false;
          } catch (dbError) {
            console.error('❌ Database error in OAuth signIn callback:', dbError);
            console.error('Error details:', {
              message: dbError instanceof Error ? dbError.message : 'Unknown',
              stack: dbError instanceof Error ? dbError.stack : undefined,
            });
            return false;
          }
        }

        console.log('✅ Sign in allowed (other provider)');
        return true;
      } catch (outerError) {
        console.error('❌ CRITICAL: Unexpected error in signIn callback:', outerError);
        console.error('Error details:', {
          message: outerError instanceof Error ? outerError.message : 'Unknown',
          stack: outerError instanceof Error ? outerError.stack : undefined,
        });
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        console.log('🎫 JWT token created/updated:', {
          id: token.id,
          email: token.email,
          role: token.role,
        });
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        console.log('📝 Session created:', {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role,
        });
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('🔀 Redirect callback:', { url, baseUrl });
      
      // Allowed callback URLs
      const allowedCallbacks = [
        '/dashboard',
        '/admin',
        '/dashboard/settings',
        '/dashboard/purchases',
        '/dashboard/licenses',
      ];
      
      // If the url is a relative path, make it absolute
      if (url.startsWith("/")) {
        const destination = `${baseUrl}${url}`;
        console.log('✅ Redirecting to relative path:', destination);
        return destination;
      }
      
      // If the url is on the same domain, allow it
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) {
          console.log('✅ Redirecting to same origin:', url);
          return url;
        }
      } catch (e) {
        console.error('⚠️ Invalid URL in redirect:', url);
      }
      
      // Default to dashboard after OAuth login
      const dashboard = `${baseUrl}/dashboard`;
      console.log('✅ Redirecting to dashboard (default):', dashboard);
      return dashboard;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
