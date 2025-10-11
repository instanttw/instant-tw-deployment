import { FAQPageJsonLd } from 'next-seo';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  return (
    <FAQPageJsonLd
      mainEntity={faqs.map((faq) => ({
        questionName: faq.question,
        acceptedAnswerText: faq.answer,
      }))}
    />
  );
}
