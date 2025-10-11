import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Mail, AlertCircle } from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      icon: Shield,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you create an account, purchase our plugins, or contact us, we collect information such as your name, email address, billing address, and payment information. We also collect information about your WordPress site URL and server configuration to provide optimal plugin functionality."
        },
        {
          subtitle: "Usage Data",
          text: "We automatically collect information about how you interact with our plugins and website, including IP addresses, browser type, operating system, pages visited, time spent on pages, and plugin usage statistics. This helps us improve our products and services."
        },
        {
          subtitle: "Technical Information",
          text: "Our plugins may collect technical data about your WordPress installation, including WordPress version, PHP version, active plugins, theme information, and performance metrics. This data is essential for compatibility checks and troubleshooting."
        }
      ]
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Provision",
          text: "We use your information to provide, maintain, and improve our WordPress plugins and services. This includes processing transactions, delivering plugin updates, and providing customer support."
        },
        {
          subtitle: "Communication",
          text: "We may send you service-related emails, including account notifications, security alerts, plugin updates, and support responses. With your consent, we may also send marketing communications about new features, products, and promotions."
        },
        {
          subtitle: "Product Improvement",
          text: "We analyze usage data to understand how our plugins are used, identify bugs, improve performance, and develop new features. All analytics data is anonymized where possible."
        },
        {
          subtitle: "Security and Fraud Prevention",
          text: "We use your information to detect, prevent, and respond to fraud, abuse, security risks, and technical issues that could harm our users or services."
        }
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        {
          subtitle: "Encryption",
          text: "All data transmission between your site and our servers is encrypted using industry-standard SSL/TLS protocols. Sensitive information like payment details is encrypted at rest using AES-256 encryption."
        },
        {
          subtitle: "Access Controls",
          text: "We implement strict access controls to ensure that only authorized personnel can access your personal information. All employees with access to user data are bound by confidentiality agreements."
        },
        {
          subtitle: "Regular Security Audits",
          text: "We conduct regular security audits and penetration testing to identify and address potential vulnerabilities. Our infrastructure is monitored 24/7 for security threats."
        }
      ]
    },
    {
      icon: Eye,
      title: "Data Sharing and Disclosure",
      content: [
        {
          subtitle: "Service Providers",
          text: "We may share your information with trusted third-party service providers who assist us in operating our business, including payment processors (Stripe), email service providers (for transactional emails), and hosting providers (AWS). These providers are contractually obligated to protect your data."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others."
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. We will notify you via email of any such change in ownership."
        },
        {
          subtitle: "No Selling of Data",
          text: "We do not sell, rent, or trade your personal information to third parties for marketing purposes. Your data is yours, and we respect that."
        }
      ]
    },
    {
      icon: AlertCircle,
      title: "Your Rights and Choices",
      content: [
        {
          subtitle: "Access and Portability",
          text: "You have the right to access your personal data and request a copy in a portable format. You can download your data from your account dashboard or contact us at privacy@instant.tw."
        },
        {
          subtitle: "Correction and Deletion",
          text: "You can update your account information at any time through your dashboard. You also have the right to request deletion of your personal data, subject to legal retention requirements."
        },
        {
          subtitle: "Marketing Opt-Out",
          text: "You can unsubscribe from marketing emails at any time by clicking the unsubscribe link in any marketing email or updating your preferences in your account settings."
        },
        {
          subtitle: "Cookie Management",
          text: "You can control cookie preferences through your browser settings. Note that disabling certain cookies may affect the functionality of our website and plugins."
        }
      ]
    },
    {
      icon: Database,
      title: "Data Retention",
      content: [
        {
          subtitle: "Active Accounts",
          text: "We retain your account information for as long as your account is active or as needed to provide you services. Plugin usage data is typically retained for 24 months."
        },
        {
          subtitle: "Inactive Accounts",
          text: "If your account is inactive for 3 years, we may delete your data after providing you with 30 days notice. You can reactivate your account at any time before deletion."
        },
        {
          subtitle: "Legal Obligations",
          text: "We may retain certain information for longer periods if required by law, for tax and accounting purposes, or to resolve disputes and enforce our agreements."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="mb-4">
              At Instant (<strong>https://instant.tw/</strong>), we take your privacy seriously. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you visit our website 
              and use our WordPress plugins.
            </p>
            <p className="mb-4">
              By using our services, you agree to the collection and use of information in accordance with this policy. 
              If you do not agree with our policies and practices, please do not use our services.
            </p>
            <p>
              This policy applies to information we collect through our website, plugins, and any related services, 
              sales, marketing, or events.
            </p>
          </CardContent>
        </Card>

        {/* Main Sections */}
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index} className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {section.content.map((item, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-lg mb-2">{item.subtitle}</h3>
                    <p className="text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}

        {/* International Users */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">International Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Our services are hosted in the United States. If you are accessing our services from outside 
              the United States, please be aware that your information may be transferred to, stored, and 
              processed in the United States where our servers are located.
            </p>
            <p className="text-muted-foreground">
              We comply with applicable data protection laws, including the General Data Protection Regulation 
              (GDPR) for users in the European Union and the California Consumer Privacy Act (CCPA) for 
              California residents.
            </p>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our services are not intended for children under 18 years of age. We do not knowingly collect 
              personal information from children under 18. If you are a parent or guardian and believe your 
              child has provided us with personal information, please contact us at privacy@instant.tw, and 
              we will delete such information from our systems.
            </p>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">What Are Cookies</h3>
              <p className="text-muted-foreground">
                Cookies are small text files stored on your device that help us provide and improve our services. 
                We use both session cookies (which expire when you close your browser) and persistent cookies 
                (which remain until you delete them or they expire).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Types of Cookies We Use</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors use our website</li>
                <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics Cookies:</strong> Help us improve our website and services</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for 
              other operational, legal, or regulatory reasons. We will notify you of any material changes by 
              posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p className="text-muted-foreground">
              We encourage you to review this Privacy Policy periodically to stay informed about how we are 
              protecting your information.
            </p>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Contact Us</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data 
              practices, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> privacy@instant.tw</p>
              <p><strong>Support:</strong> wp@instant.tw</p>
              <p><strong>Website:</strong> https://instant.tw/</p>
              <p className="mt-4">
                <strong>Data Protection Officer:</strong> dpo@instant.tw
              </p>
            </div>
            <p className="text-muted-foreground mt-6">
              We will respond to all legitimate requests within 30 days. If your request is complex or 
              you have made multiple requests, it may take us longer, but we will notify you within 30 days.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
