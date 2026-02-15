'use client'

import { useState, useEffect } from 'react'
import { Student } from '@/lib/types'

interface DesignThinkingToolProps {
  student: Student
  onUpdate: (data: any) => void
}

const stages = [
  { id: 'connectDefine', label: 'Connect & Define', position: 'top' },
  { id: 'ideate', label: 'Ideate', position: 'right' },
  { id: 'create', label: 'Create', position: 'bottom-right' },
  { id: 'implement', label: 'Implement', position: 'bottom-left' },
  { id: 'reflectImprove', label: 'Reflect & Improve', position: 'left' },
]

export default function DesignThinkingTool({ student, onUpdate }: DesignThinkingToolProps) {
  const [responses, setResponses] = useState(
    student.responses.designThinking || {
      connectDefine: '',
      ideate: '',
      create: '',
      implement: '',
      reflectImprove: '',
    }
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdate(responses)
    }, 500)
    return () => clearTimeout(timer)
  }, [responses, onUpdate])

  const handleChange = (stageId: string, value: string) => {
    setResponses(prev => ({ ...prev, [stageId]: value }))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Design Thinking Process</h2>
      <div className="flex justify-center">
        <div className="relative" style={{ width: '700px', height: '700px' }}>
          {/* Circular layout with SVG arrows */}
          <svg width="700" height="700" className="absolute top-0 left-0 pointer-events-none">
<<<<<<< HEAD
            {/* Arrows connecting stages in circular flow */}
            <path
              d="M 350 50 Q 500 150 500 250"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
            />
            <path
              d="M 500 250 Q 550 350 500 450"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
            />
            <path
              d="M 500 450 Q 350 550 200 450"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
            />
            <path
              d="M 200 450 Q 100 350 200 250"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
            />
            <path
              d="M 200 250 Q 200 150 350 50"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
            />
=======
>>>>>>> master
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#3B82F6" />
              </marker>
            </defs>
<<<<<<< HEAD
=======
            
            {/* Connect & Define (top) -> Ideate (right): from right middle of top box to top middle of right box */}
            <path
              d="M 450 74 L 600 250"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
            />
            
            {/* Ideate (right) -> Create (bottom-right): straight line from bottom center of right box to top center of bottom-right box */}
            <path
              d="M 600 398 L 500 500"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
            />
            
            {/* Create (bottom-right) -> Implement (bottom-left): straight line from left center of bottom-right box to right center of bottom-left box */}
            <path
              d="M 400 574 L 300 574"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
            />
            
            {/* Implement (bottom-left) -> Reflect & Improve (left): from top middle of implement to bottom middle of reflect and improve */}
            <path
              d="M 200 500 L 100 398"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
            />
            
            {/* Reflect & Improve (left) -> Connect & Define (top): from top middle of reflect and improve to left middle of connect and define */}
            <path
              d="M 100 250 L 250 74"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
            />
>>>>>>> master
          </svg>

          {/* Stage boxes */}
          {stages.map((stage) => {
            let position = { top: 0, left: 0 }
            switch (stage.position) {
              case 'top':
                position = { top: 0, left: 250 }
                break
              case 'right':
                position = { top: 250, left: 500 }
                break
              case 'bottom-right':
                position = { top: 500, left: 400 }
                break
              case 'bottom-left':
                position = { top: 500, left: 100 }
                break
              case 'left':
                position = { top: 250, left: 0 }
                break
            }

            return (
              <div
                key={stage.id}
                className="absolute bg-blue-50 border-2 border-blue-600 rounded-lg p-3 z-10"
                style={{
                  top: `${position.top}px`,
                  left: `${position.left}px`,
                  width: '200px',
                }}
              >
                <div className="font-semibold text-blue-800 text-sm mb-2">
                  {stage.label}
                </div>
                <textarea
                  value={responses[stage.id as keyof typeof responses] || ''}
                  onChange={(e) => handleChange(stage.id, e.target.value)}
                  placeholder="Type your ideas..."
                  className="w-full h-24 p-2 text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
<<<<<<< HEAD

=======
>>>>>>> master
