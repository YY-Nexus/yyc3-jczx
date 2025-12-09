"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

export type WizardStep = {
  id: string
  title: string
  description: string
}

export type ConnectionStatus = "idle" | "testing" | "success" | "error"

export type WizardContextType = {
  currentStepIndex: number
  steps: WizardStep[]
  formData: Record<string, any>
  connectionStatus: ConnectionStatus
  connectionMessage: string
  setCurrentStepIndex: (index: number) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  updateFormData: (data: Record<string, any>) => void
  setConnectionStatus: (status: ConnectionStatus, message?: string) => void
  resetWizard: () => void
  isLastStep: boolean
  isFirstStep: boolean
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

export const useWizard = () => {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider")
  }
  return context
}

type WizardProviderProps = {
  children: ReactNode
  steps: WizardStep[]
  initialData?: Record<string, any>
}

export const WizardProvider: React.FC<WizardProviderProps> = ({ children, steps, initialData = {} }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>(initialData)
  const [connectionStatus, setConnectionStatusState] = useState<ConnectionStatus>("idle")
  const [connectionMessage, setConnectionMessage] = useState("")

  const isLastStep = currentStepIndex === steps.length - 1
  const isFirstStep = currentStepIndex === 0

  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const updateFormData = (data: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const setConnectionStatus = (status: ConnectionStatus, message = "") => {
    setConnectionStatusState(status)
    setConnectionMessage(message)
  }

  const resetWizard = () => {
    setCurrentStepIndex(0)
    setFormData(initialData)
    setConnectionStatusState("idle")
    setConnectionMessage("")
  }

  return (
    <WizardContext.Provider
      value={{
        currentStepIndex,
        steps,
        formData,
        connectionStatus,
        connectionMessage,
        setCurrentStepIndex,
        goToNextStep,
        goToPreviousStep,
        updateFormData,
        setConnectionStatus,
        resetWizard,
        isLastStep,
        isFirstStep,
      }}
    >
      {children}
    </WizardContext.Provider>
  )
}
