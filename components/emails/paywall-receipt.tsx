import React from "react";

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { Footer } from "./shared/footer";

interface PaywallReceiptEmailProps {
  email: string | null | undefined;
  linkUrl: string;
}

const PaywallReceiptEmail = ({ email, linkUrl }: PaywallReceiptEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Guide Access is Ready!</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded border border-solid border-neutral-200 px-10 py-5">
            <Section className="mt-8">
              <Text className="text-2xl font-bold tracking-tighter">
                Closing Nation
              </Text>
            </Section>
            <Heading className="mx-0 my-7 p-0 text-xl font-semibold text-black">
              Welcome to your digital vault!
            </Heading>
            <Text className="mb-8 text-sm leading-6 text-gray-600">
              Thank you for your purchase! Your email (<strong>{email}</strong>) has been securely authorized for permanent lifetime access to the documents.
            </Text>

            <Hr />

            <Heading className="mx-0 my-6 p-0 text-lg font-semibold text-black">
              Access Instructions
            </Heading>

            <Text className="mb-4 text-sm leading-6 text-gray-600">
              <strong className="font-medium text-black">
                1. Access the Documents
              </strong>
              : Simply click the secure access link below whenever you need to view your guides.
            </Text>

            <Text className="mb-4 text-sm leading-6 text-gray-600">
              <strong className="font-medium text-black">
                2. Authenticate
              </strong>
              : When prompted, enter the exact email address you used to complete this purchase. Our system will recognize you immediately.
            </Text>

            <Section className="my-8 text-center">
              <Link
                className="rounded-lg bg-black px-6 py-4 text-center text-[14px] font-semibold text-white no-underline shadow-md"
                href={linkUrl}
              >
                Access Your Guide
              </Link>
            </Section>

            <Hr />
            <Text className="text-xs text-gray-400 mt-8">
              If you lose this email, you can always request a new access link or contact support. 
              Please do not forward this specific link to others, as access is restricted uniquely to your email address.
            </Text>

            <Footer marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PaywallReceiptEmail;
