import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle, Shield, DollarSign, Ban, Scale } from "lucide-react";

export default function TermsOfServicePage() {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: `By accessing or using Instant's website (https://instant.tw/) and WordPress plugins, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.

These terms apply to all users of the site and plugins, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.`
    },
    {
      icon: Shield,
      title: "2. License and Restrictions",
      content: `**License Grant**

Subject to your compliance with these Terms and payment of applicable fees, we grant you a limited, non-exclusive, non-transferable, revocable license to download, install, and use our WordPress plugins on the number of websites specified in your chosen plan (Free: 1 site, Pro: 5 sites, Agency: Unlimited sites).

**Restrictions**

You may not:
• Redistribute, sell, lease, or sublicense our plugins to third parties
• Reverse engineer, decompile, or disassemble the plugins
• Remove or modify any copyright notices or proprietary markings
• Use the plugins for any illegal or unauthorized purpose
• Attempt to gain unauthorized access to our systems or networks
• Use automated systems to access our services without written permission
• Create derivative works based on our plugins without our written consent

**Updates and Support**

Active subscribers receive automatic updates and access to customer support. Upon expiration of your subscription, you may continue to use the plugin at the version installed at expiration, but you will not receive updates or support.`
    },
    {
      icon: DollarSign,
      title: "3. Pricing and Payment",
      content: `**Subscription Plans**

We offer multiple subscription plans (Free, Pro, Agency, Enterprise) with different features and site limits. Prices are displayed in USD and may be subject to applicable taxes.

**Payment Terms**

• All subscriptions are billed in advance on a monthly or annual basis
• Payment is due immediately upon purchase or renewal
• We accept major credit cards and PayPal through our payment processor, Stripe
• All fees are non-refundable except as stated in our Refund Policy
• Prices are subject to change with 30 days notice to existing customers

**Automatic Renewal**

Subscriptions automatically renew at the end of each billing period unless you cancel before the renewal date. You can cancel anytime from your account dashboard. Cancellations take effect at the end of the current billing period.

**Failed Payments**

If a payment fails, we will attempt to charge your payment method up to 3 times. If all attempts fail, your subscription will be downgraded or suspended, and access to premium features will be restricted.`
    },
    {
      icon: AlertTriangle,
      title: "4. User Responsibilities",
      content: `**Account Security**

You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately at security@instant.tw of any unauthorized use of your account.

**Acceptable Use**

You agree to use our plugins only for lawful purposes and in accordance with these Terms. You will not:
• Use plugins to spam or send unsolicited communications
• Violate any applicable laws or regulations
• Infringe on intellectual property rights of others
• Transmit viruses, malware, or harmful code
• Interfere with or disrupt our services or servers
• Impersonate any person or entity

**Your Content**

You retain all rights to content on your WordPress site. However, you grant us permission to access your site data solely for the purpose of providing our services, including troubleshooting and support. We will not access your site data for any other purpose without your explicit consent.`
    },
    {
      icon: Scale,
      title: "5. Intellectual Property",
      content: `**Our Rights**

All content on our website and within our plugins, including but not limited to text, graphics, logos, icons, images, audio clips, and software, is the property of Instant or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws.

**Trademarks**

"Instant" and all related logos and product names are trademarks of Instant. You may not use these marks without our prior written permission.

**DMCA Policy**

We respect the intellectual property rights of others. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please contact us at dmca@instant.tw with the following information:
• A description of the copyrighted work
• The URL where the alleged infringement is located
• Your contact information
• A statement that you have a good faith belief that the use is not authorized
• A statement that the information is accurate and you are authorized to act on behalf of the copyright owner`
    },
    {
      icon: Ban,
      title: "6. Limitation of Liability",
      content: `**Disclaimer of Warranties**

OUR PLUGINS AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT OUR PLUGINS WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.

**Limitation of Liability**

TO THE MAXIMUM EXTENT PERMITTED BY LAW, INSTANT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF OUR SERVICES.

OUR TOTAL LIABILITY FOR ANY CLAIMS UNDER THESE TERMS IS LIMITED TO THE AMOUNT YOU PAID US IN THE 12 MONTHS PRIOR TO THE EVENT GIVING RISE TO THE LIABILITY.

**Indemnification**

You agree to indemnify, defend, and hold harmless Instant, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable attorney fees, arising out of or in any way connected with your use of our plugins or violation of these Terms.`
    },
    {
      icon: FileText,
      title: "7. Data and Privacy",
      content: `**Privacy Policy**

Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy at https://instant.tw/privacy to understand our practices.

**Data Processing**

When you use our plugins, we may process certain data from your WordPress installation for the purpose of providing our services. This may include:
• WordPress version and configuration
• Plugin usage statistics
• Performance metrics
• Error logs for debugging purposes

You represent and warrant that you have all necessary rights and consents to provide us with any data that we process on your behalf.

**GDPR Compliance**

For users in the European Union, we comply with the General Data Protection Regulation (GDPR). You have the right to access, correct, delete, or export your personal data. Contact us at privacy@instant.tw to exercise these rights.`
    },
    {
      icon: AlertTriangle,
      title: "8. Termination",
      content: `**Termination by You**

You may cancel your subscription at any time through your account dashboard. Cancellation will take effect at the end of your current billing period. You will not receive a refund for the remaining period.

**Termination by Us**

We reserve the right to suspend or terminate your access to our services at any time, with or without notice, for conduct that we believe:
• Violates these Terms or our Acceptable Use Policy
• Harms our business interests or reputation
• Exposes us or other users to legal liability
• Results from fraudulent activity

Upon termination:
• Your license to use our plugins immediately ceases
• You must uninstall all copies of our plugins from your websites
• We may delete your account data after 30 days
• Provisions that should survive termination (payment obligations, liability limitations) will remain in effect`
    },
    {
      icon: Scale,
      title: "9. Dispute Resolution",
      content: `**Governing Law**

These Terms are governed by and construed in accordance with the laws of the United States and the State of California, without regard to its conflict of law provisions.

**Arbitration**

Any dispute arising from these Terms or your use of our services will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, rather than in court. You waive your right to participate in a class action lawsuit or class-wide arbitration.

**Exceptions**

Either party may seek injunctive relief in court for intellectual property infringement or unauthorized access to our systems.

**Informal Resolution**

Before initiating arbitration, you agree to contact us at legal@instant.tw to seek an informal resolution. We will attempt to resolve the dispute within 60 days.`
    },
    {
      icon: FileText,
      title: "10. General Provisions",
      content: `**Entire Agreement**

These Terms, together with our Privacy Policy and Refund Policy, constitute the entire agreement between you and Instant regarding our services.

**Modifications**

We reserve the right to modify these Terms at any time. We will notify you of material changes via email or through a notice on our website at least 30 days before the changes take effect. Your continued use of our services after the changes take effect constitutes acceptance of the modified Terms.

**Severability**

If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.

**Waiver**

Our failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.

**Assignment**

You may not assign or transfer these Terms or your rights and obligations under them without our prior written consent. We may assign these Terms without your consent in connection with a merger, acquisition, or sale of assets.

**Force Majeure**

We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, pandemics, or network infrastructure failures.`
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <p className="mb-4">
              <strong>PLEASE READ THESE TERMS OF SERVICE CAREFULLY</strong>
            </p>
            <p className="mb-4">
              These Terms of Service ("Terms") govern your access to and use of Instant's WordPress plugins 
              and services. By using our services, you enter into a legally binding agreement with Instant.
            </p>
            <p>
              If you are using our services on behalf of an organization, you represent that you have the 
              authority to bind that organization to these Terms.
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
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground whitespace-pre-line">
                  {section.content}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Contact Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Questions About These Terms?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Legal Inquiries:</strong> legal@instant.tw</p>
              <p><strong>General Support:</strong> wp@instant.tw</p>
              <p><strong>Website:</strong> https://instant.tw/</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
