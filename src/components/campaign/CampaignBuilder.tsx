"use client";

import { useCampaignStore } from "@/store/campaign";
import StepIndicator from "@/components/ui/StepIndicator";
import Step1Type from "./Step1Type";
import Step2Audience from "./Step2Audience";
import Step3Budget from "./Step3Budget";
import Step4Review from "./Step4Review";

const stepLabels = ["Type", "Audience", "Budget", "Review"];

const steps = [Step1Type, Step2Audience, Step3Budget, Step4Review];

export default function CampaignBuilder() {
  const { stepIndex } = useCampaignStore();

  const CurrentStep = steps[stepIndex];

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
      <StepIndicator
        currentStep={stepIndex}
        totalSteps={4}
        labels={stepLabels}
      />

      <div className="mt-8">
        <CurrentStep />
      </div>
    </div>
  );
}
