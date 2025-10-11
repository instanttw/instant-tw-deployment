import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string;
    plan?: string;
    image?: string;
    role?: 'customer' | 'admin';
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      plan?: string;
      image?: string;
      role?: 'customer' | 'admin';
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    plan?: string;
    role?: 'customer' | 'admin';
  }
}
