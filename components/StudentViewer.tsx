'use client'

import { Student } from '@/lib/types'
import DesignThinkingViewer from '@/components/tools/DesignThinkingViewer'
import DecisionMatrixViewer from '@/components/tools/DecisionMatrixViewer'
import DrawingViewer from '@/components/tools/DrawingViewer'
import QuestionsViewer from '@/components/tools/QuestionsViewer'
import VennDiagramViewer from '@/components/tools/VennDiagramViewer'

interface StudentViewerProps {
  student: Student
  activeTools: string[]
}

export default function StudentViewer({ student, activeTools }: StudentViewerProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {student.name}&#39;s Responses
      </h2>
      <div className="space-y-6">
        {activeTools.map((toolType) => {
          switch (toolType) {
            case 'designThinking':
              return (
                <DesignThinkingViewer
                  key={toolType}
                  responses={student.responses.designThinking}
                />
              )
            case 'decisionMatrix':
              return (
                <DecisionMatrixViewer
                  key={toolType}
                  data={student.responses.decisionMatrix}
                />
              )
            case 'drawing':
              return (
                <DrawingViewer
                  key={toolType}
                  imageData={student.responses.drawing}
                />
              )
            case 'questions':
              return (
                <QuestionsViewer
                  key={toolType}
                  questions={student.responses.questions}
                />
              )
            case 'vennDiagram':
              return (
                <VennDiagramViewer
                  key={toolType}
                  data={student.responses.vennDiagram}
                />
              )
            case 'graph':
              return (
                <div key={toolType} className="text-sm text-gray-500 italic">
                  Graph tool — student uses Desmos in their Activities tab.
                </div>
              )
            default:
              return null
          }
        })}
        {activeTools.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            No active tools to display
          </div>
        )}
      </div>
    </div>
  )
}
