export type OnboardingStep =
  | "business"
  | "services"
  | "contact"
  | "social"
  | "location"
  | "media"
  | "review";

export interface OnboardingStepItem {
  id: OnboardingStep;
  label: string;
}
