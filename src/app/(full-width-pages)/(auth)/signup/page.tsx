import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NimbleMeet Sign In | AI Automated WhatsApp Chatbot",
  description:
    "Sign in to NimbleMeet – an AI-powered automated WhatsApp chatbot platform for smart appointment booking, customer engagement, and business automation.",
};

export default function SignUp() {
  return <SignUpForm />;
}
