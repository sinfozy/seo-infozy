import * as React from "react";

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type VerifyEmailProps = {
  name: string;
  otp: string;
  verifyUrl: string;
};

export default function VerifyEmailTemplate({
  name,
  otp,
  verifyUrl,
}: VerifyEmailProps) {
  const primaryColor = "oklch(0.623 0.214 259.815)";

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 font-sans p-6">
          <Container className="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            {/* Logo / Heading */}
            <Heading className="text-2xl font-bold text-gray-800 mb-4">
              Verify your email address
            </Heading>

            {/* Greeting */}
            <Text className="text-gray-700">
              Hi <span className="font-semibold">{name}</span>,
            </Text>

            {/* Explanation */}
            <Text className="text-gray-600 mt-2">
              Thanks for signing up! Please verify your email address to
              complete your registration and secure your account.
            </Text>

            {/* OTP Section */}
            <Section className="mt-6 text-center">
              <Text className="text-gray-600 mb-2">
                Your verification code:
              </Text>
              <Text
                className="text-3xl font-bold tracking-widest"
                style={{ color: primaryColor }}
              >
                {otp}
              </Text>
            </Section>

            {/* Button */}
            <Section className="mt-6 text-center">
              <Button
                href={verifyUrl}
                className="px-6 py-3 rounded-lg font-semibold text-white"
                style={{ backgroundColor: primaryColor }}
              >
                Verify Email
              </Button>
            </Section>

            {/* Expiry Info */}
            <Text className="text-gray-500 mt-6 text-sm">
              This code will expire in 10 minutes. If the button above doesn’t
              work, you can use the code directly in the app.
            </Text>

            {/* Footer */}
            <Text className="text-gray-400 mt-8 text-xs">
              If you didn’t create an account with SEO Infozy, you can safely
              ignore this email.
            </Text>

            <Text className="text-gray-600 mt-4">
              Thanks, <br />
              <span className="font-semibold">The SEO Infozy Team</span>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
