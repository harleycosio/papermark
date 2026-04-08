import { sendEmail } from "@/lib/resend";

import PaywallReceiptEmail from "@/components/emails/paywall-receipt";

interface SendPaywallReceiptProps {
  email: string;
  linkId: string;
}

export const sendPaywallReceipt = async (params: SendPaywallReceiptProps) => {
  const { email, linkId } = params;
  const linkUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/view/${linkId}`;
  
  const emailTemplate = PaywallReceiptEmail({ email, linkUrl });
  try {
    await sendEmail({
      to: email,
      marketing: true, // We can treat this as a standard marketing/transactional mixed send for unsubscribe compliance
      subject: "Your Guide Access is Ready - ClosingNation",
      react: emailTemplate,
      test: process.env.NODE_ENV === "development",
      unsubscribeUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/account/general`,
    });
  } catch (e) {
    console.error("Failed to send paywall receipt email:", e);
  }
};
