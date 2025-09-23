import * as React from "react";

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type ResetPasswordSuccessProps = {
  name: string;
};

export default function ResetPasswordSuccessTemplate({
  name,
}: ResetPasswordSuccessProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 font-sans p-6">
          <Container className="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            {/* Heading */}
            <Heading className="text-2xl font-bold text-gray-800 mb-4">
              Password Reset Successful 🎉
            </Heading>

            {/* Greeting */}
            <Text className="text-gray-700">
              Hi <span className="font-semibold">{name}</span>,
            </Text>

            {/* Explanation */}
            <Text className="text-gray-600 mt-2">
              Your password has been successfully updated. You can now log in
              with your new credentials.
            </Text>

            {/* Security Info */}
            <Section className="mt-4">
              <Text className="text-gray-500 text-sm">
                If you did not make this change, please contact our support team
                immediately to secure your account.
              </Text>
            </Section>

            {/* Footer */}
            <Text className="text-gray-600 mt-6">
              Thanks, <br />
              <span className="font-semibold">The SEO Infozy Team</span>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
