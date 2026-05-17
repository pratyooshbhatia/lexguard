import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const metadata = { title: "How LexGuard works" };

export default function OnboardingPage() {
  return (
    <main id="main" className="mx-auto max-w-xl px-4 py-10 sm:py-16">
      <OnboardingFlow />
    </main>
  );
}
