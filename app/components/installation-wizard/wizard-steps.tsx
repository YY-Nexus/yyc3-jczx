"use client"

import React from "react"

import { Check } from "lucide-react"
import { useWizard } from "./wizard-context"
import { cn } from "@/lib/utils"

export function WizardSteps() {
  const { steps, currentStepIndex } = useWizard()

  return (
    <div className="mb-8">
      <div className="relative flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex
          const isCompleted = index < currentStepIndex

          return (
            <React.Fragment key={step.id}>
              {/* 连接线 */}
              {index > 0 && (
                <div
                  className={cn(
                    "absolute h-0.5 top-1/2 transform -translate-y-1/2 z-0",
                    isCompleted ? "bg-primary" : "bg-gray-200",
                  )}
                  style={{
                    left: `calc(${((index - 1) / (steps.length - 1)) * 100}% + 12px)`,
                    right: `calc(${100 - (index / (steps.length - 1)) * 100}% + 12px)`,
                  }}
                ></div>
              )}

              {/* 步骤圆点 */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2",
                    isActive
                      ? "border-primary bg-primary text-white"
                      : isCompleted
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 bg-white text-gray-400",
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <div
                  className={cn(
                    "mt-2 text-xs font-medium text-center",
                    isActive ? "text-primary" : isCompleted ? "text-primary" : "text-gray-500",
                  )}
                >
                  {step.title}
                </div>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
