'use client'

import { ToolType } from '@/lib/types'

interface ToolSelectorProps {
  activeTools: string[]
  onToggleTool: (toolType: ToolType) => void
}

const tools: Array<{ id: ToolType; name: string; description: string }> = [
  {
    id: 'designThinking',
    name: 'Design Thinking Process',
    description: 'Circular process diagram with fill-in-the-blank stages',
  },
  {
    id: 'decisionMatrix',
    name: 'Decision Matrix',
    description: 'Weighted scoring matrix for group decisions',
  },
  {
    id: 'drawing',
    name: 'Drawing Page',
    description: 'Canvas for sketching ideas',
  },
  {
    id: 'questions',
    name: 'Questions',
    description: 'Teacher questions and student responses',
  },
<<<<<<< HEAD
=======
  {
    id: 'vennDiagram',
    name: 'Venn Diagram',
    description: 'Interactive diagram for comparing and contrasting sets',
  },
  {
    id: 'graph',
    name: 'Graph (Desmos)',
    description: 'Desmos graphing calculator embedded in the page',
  },
>>>>>>> master
]

export default function ToolSelector({ activeTools, onToggleTool }: ToolSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Tools</h2>
      <div className="grid grid-cols-2 gap-4">
        {tools.map((tool) => {
          const isActive = activeTools.includes(tool.id)
          return (
            <label
              key={tool.id}
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isActive
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => onToggleTool(tool.id)}
                className="mt-1 mr-3 w-5 h-5 text-blue-600"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{tool.name}</div>
                <div className="text-sm text-gray-600 mt-1">{tool.description}</div>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}


