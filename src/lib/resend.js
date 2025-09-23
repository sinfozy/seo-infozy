import React from "react";
import { Resend } from "resend";
import ResetPasswordSuccessTemplate from "./email-templates/resetPasswordSuccess";
import ResetPasswordTemplate from "./email-templates/resetPasswordEmail";
import VerifyEmailTemplate from "./email-templates/otpEmail";
import WelcomeEmailTemplate from "./email-templates/welcome";

const resend = new Resend(process.env.RESEND_API_KEY);

const templates = {
  verifyEmailOtp: VerifyEmailTemplate,
  welcome: WelcomeEmailTemplate,
  resetPassword: ResetPasswordTemplate,
  passwordResetSuccess: ResetPasswordSuccessTemplate,
};

export async function sendEmail({ to, subject, templateName, data }) {
  try {
    const TemplateComponent = templates[templateName];
    const react = React.createElement(TemplateComponent, data);

    await resend.emails.send({
      from: "SEO Infozy <support@infozysms.com>",
      to,
      subject,
      react,
    });

    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("sendEmail error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}
