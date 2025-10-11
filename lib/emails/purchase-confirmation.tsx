import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface PurchaseEmailProps {
  customerName: string;
  orderNumber: string;
  products: Array<{
    name: string;
    price: string;
  }>;
  licenses: Array<{
    product: string;
    key: string;
  }>;
  totalAmount: string;
  orderDate: string;
}

export default function PurchaseConfirmationEmail({
  customerName = 'Customer',
  orderNumber = 'ORD-000001',
  products = [],
  licenses = [],
  totalAmount = '$0.00',
  orderDate = new Date().toLocaleDateString(),
}: PurchaseEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your purchase from Instant.tw - Order {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://wp.instant.tw/logo.png"
            width="150"
            height="40"
            alt="Instant.tw"
            style={logo}
          />
          <Heading style={h1}>Thank you for your purchase!</Heading>
          <Text style={text}>
            Hi {customerName},
          </Text>
          <Text style={text}>
            Your order has been confirmed and is ready to use. Below are your license keys and download links.
          </Text>

          <Section style={orderInfo}>
            <Text style={orderDetail}>
              <strong>Order Number:</strong> {orderNumber}
            </Text>
            <Text style={orderDetail}>
              <strong>Order Date:</strong> {orderDate}
            </Text>
            <Text style={orderDetail}>
              <strong>Total Amount:</strong> {totalAmount}
            </Text>
          </Section>

          <Heading as="h2" style={h2}>
            Your Products
          </Heading>
          {products.map((product, index) => (
            <Section key={index} style={productSection}>
              <Text style={productName}>{product.name}</Text>
              <Text style={productPrice}>{product.price}</Text>
            </Section>
          ))}

          <Heading as="h2" style={h2}>
            Your License Keys
          </Heading>
          <Text style={text}>
            Use these license keys to activate your plugins:
          </Text>
          {licenses.map((license, index) => (
            <Section key={index} style={licenseSection}>
              <Text style={licenseName}>{license.product}</Text>
              <code style={licenseKey}>{license.key}</code>
            </Section>
          ))}

          <Section style={buttonContainer}>
            <Button style={button} href="https://wp.instant.tw/dashboard/licenses">
              View My Licenses
            </Button>
          </Section>

          <Section style={buttonContainer}>
            <Button style={downloadButton} href="https://wp.instant.tw/dashboard/purchases">
              Download Products
            </Button>
          </Section>

          <Text style={footer}>
            Need help? Contact us at{' '}
            <Link href="mailto:support@instant.tw" style={link}>
              support@instant.tw
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logo = {
  margin: '0 auto',
  marginBottom: '32px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '30px 0 15px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const orderInfo = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  margin: '30px 0',
};

const orderDetail = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '5px 0',
};

const productSection = {
  borderBottom: '1px solid #e5e7eb',
  padding: '15px 0',
};

const productName = {
  color: '#333',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const productPrice = {
  color: '#666',
  fontSize: '16px',
  margin: '0',
};

const licenseSection = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  padding: '15px',
  margin: '10px 0',
};

const licenseName = {
  color: '#333',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const licenseKey = {
  backgroundColor: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '4px',
  color: '#0070f3',
  fontFamily: 'monospace',
  fontSize: '14px',
  padding: '10px',
  display: 'block',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#0070f3',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 30px',
};

const downloadButton = {
  ...button,
  backgroundColor: '#10b981',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '48px 0 0',
  textAlign: 'center' as const,
};

const link = {
  color: '#0070f3',
  textDecoration: 'underline',
};
