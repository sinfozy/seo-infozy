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

type ResetPasswordProps = {
  name: string;
  resetUrl: string;
};

export default function ResetPasswordTemplate({
  name,
  resetUrl,
}: ResetPasswordProps) {
  const primaryColor = "oklch(0.623 0.214 259.815)";

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 font-sans p-6">
          <Container className="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            {/* Heading */}
            <Heading className="text-2xl font-bold text-gray-800 mb-4">
              Reset your password
            </Heading>

            {/* Greeting */}
            <Text className="text-gray-700">
              Hi <span className="font-semibold">{name}</span>,
            </Text>

            {/* Explanation */}
            <Text className="text-gray-600 mt-2">
              We received a request to reset your password. Click the button
              below to set a new one.
            </Text>

            {/* Reset Button */}
            <Section className="mt-6 text-center">
              <Button
                href={resetUrl}
                className="px-6 py-3 rounded-lg font-semibold text-white"
                style={{ backgroundColor: primaryColor }}
              >
                Reset Password
              </Button>
            </Section>

            {/* Expiry Info */}
            <Text className="text-gray-500 mt-6 text-sm">
              For your security, this link will expire in 10 minutes. If you
              didn’t request a password reset, you can safely ignore this email.
            </Text>

            {/* Footer */}
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
