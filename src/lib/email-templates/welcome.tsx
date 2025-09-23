import * as React from "react";

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmailTemplate: React.FC<WelcomeEmailProps> = ({ name }) => {
  const primaryColor = "oklch(0.623 0.214 259.815)";

  return (
    <Html>
      <Head />
      <Preview>
        Welcome to SEO Infozy! Start growing your business with AI-powered SEO
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={{ ...heading, color: primaryColor }}>
            Welcome to SEO Infozy, {name}! 🎉
          </Heading>

          <Text style={text}>
            Congratulations! Your account is ready, and you now have full access
            to SEO Infozy.
          </Text>

          <Text style={text}>
            Here’s a sneak peek at the powerful services you can use to grow
            your website and online presence:
          </Text>

          <Section>
            <ul style={list}>
              <li>
                🌐 <strong>Website Research</strong> – Analyze websites and
                competitors efficiently.
              </li>
              <li>
                🔑 <strong>Keyword Research</strong> – Discover the most
                profitable keywords for your niche.
              </li>
              <li>
                📈 <strong>SEO</strong> – Optimize your website for better
                search engine rankings.
              </li>
              <li>
                🔍 <strong>Ssearch</strong> – Smart search tools to uncover
                opportunities and trends.
              </li>
              <li>
                🤖 <strong>Infyra Search</strong> – AI-powered SEO that helps
                you grow faster and smarter.
              </li>
            </ul>
          </Section>

          <Text style={text}>
            Start exploring now and take your SEO game to the next level! 🚀
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            You’re receiving this email because you signed up for SEO Infozy.
            <br />
            If you didn’t, please ignore this message.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmailTemplate;

//
// Styles
//
const main = {
  backgroundColor: "#f9fafb",
  fontFamily: "Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
};

const heading = {
  fontSize: "22px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const text = {
  color: "#111",
  fontSize: "14px",
  lineHeight: "1.6",
  marginBottom: "16px",
};

const list = {
  paddingLeft: "20px",
  marginBottom: "20px",
};

const hr = {
  margin: "30px 0",
  borderColor: "#ddd",
};

const footer = {
  fontSize: "12px",
  color: "#555",
};
