'use client'

interface DesignThinkingViewerProps {
  responses?: {
    connectDefine?: string
    ideate?: string
    create?: string
    implement?: string
    reflectImprove?: string
  }
}

export default function DesignThinkingViewer({ responses }: DesignThinkingViewerProps) {
  if (!responses) {
    return (
      <div className="text-gray-500 text-center py-4">
        No responses yet
      </div>
    )
  }

  const stages = [
    { id: 'connectDefine', label: 'Connect & Define', value: responses.connectDefine },
    { id: 'ideate', label: 'Ideate', value: responses.ideate },
    { id: 'create', label: 'Create', value: responses.create },
    { id: 'implement', label: 'Implement', value: responses.implement },
    { id: 'reflectImprove', label: 'Reflect & Improve', value: responses.reflectImprove },
  ]

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">Design Thinking Process</h3>
      <div className="space-y-3">
        {stages.map((stage) => (
          <div key={stage.id} className="border rounded-lg p-4">
            <div className="font-semibold text-gray-700 mb-2">{stage.label}</div>
            <div className="text-gray-600 whitespace-pre-wrap min-h-[60px]">
              {stage.value || '(No response yet)'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


