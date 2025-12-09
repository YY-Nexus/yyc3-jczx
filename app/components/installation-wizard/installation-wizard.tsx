"use client"

import { WizardContainer } from "./wizard-container"
import { useWizard } from "./wizard-context"
import { StepBasicInfo } from "./step-basic-info"
import { StepAuthentication } from "./step-authentication"
import { StepConfiguration } from "./step-configuration"
import { StepConnectionTest } from "./step-connection-test"
import { StepCompletion } from "./step-completion"
import type { Integration } from "@/app/data/integrations"

interface InstallationWizardProps {
  integration: Integration
}

export function InstallationWizard({ integration }: InstallationWizardProps) {
  const steps = [
    {
      id: "basic-info",
      title: "基本信息",
      description: "设置集成的基本信息",
    },
    {
      id: "authentication",
      title: "认证",
      description: "配置认证信息",
    },
    {
      id: "configuration",
      title: "配置",
      description: "设置集成选项",
    },
    {
      id: "connection-test",
      title: "连接测试",
      description: "测试连接",
    },
    {
      id: "completion",
      title: "完成",
      description: "安装完成",
    },
  ]

  const initialData = {
    name: integration.name,
  }

  return (
    <WizardContainer
      title={`安装 ${integration.name}`}
      description="按照以下步骤安装和配置集成应用"
      steps={steps}
      initialData={initialData}
    >
      <WizardStepContent />
    </WizardContainer>
  )
}

function WizardStepContent() {
  const { currentStepIndex, steps } = useWizard()
  const currentStep = steps[currentStepIndex]

  switch (currentStep.id) {
    case "basic-info":
      return <StepBasicInfo />
    case "authentication":
      return <StepAuthentication />
    case "configuration":
      return <StepConfiguration />
    case "connection-test":
      return <StepConnectionTest />
    case "completion":
      return <StepCompletion />
    default:
      return <div>未知步骤</div>
  }
}
