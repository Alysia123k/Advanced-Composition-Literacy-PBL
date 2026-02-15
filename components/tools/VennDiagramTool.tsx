'use client'

import { useState, useCallback } from 'react'
import { Student } from '@/lib/types'

interface VennDiagramToolProps {
  student: Student
  onUpdate: (data: any) => void
}

export default function VennDiagramTool({ student, onUpdate }: VennDiagramToolProps) {
  const [leftLabel, setLeftLabel] = useState(student.responses.vennDiagram?.leftLabel || 'Set A')
  const [rightLabel, setRightLabel] = useState(student.responses.vennDiagram?.rightLabel || 'Set B')
  const [items, setItems] = useState(student.responses.vennDiagram?.items || [])
  const [newItemText, setNewItemText] = useState('')

  const handleUpdate = useCallback(() => {
    const data = {
      leftLabel,
      rightLabel,
      items
    }
    onUpdate(data)
  }, [leftLabel, rightLabel, items, onUpdate])

  const addItem = (position: 'left' | 'right' | 'center') => {
    if (!newItemText.trim()) return

    const newItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      position
    }

    const updatedItems = [...items, newItem]
    setItems(updatedItems)
    setNewItemText('')
    handleUpdate()
  }

  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id)
    setItems(updatedItems)
    handleUpdate()
  }

  const moveItem = (id: string, newPosition: 'left' | 'right' | 'center') => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, position: newPosition } : item
    )
    setItems(updatedItems)
    handleUpdate()
  }

  const getItemsByPosition = (position: 'left' | 'right' | 'center') => {
    return items.filter(item => item.position === position)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Venn Diagram</h2>

      {/* Label inputs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Left Set Label
          </label>
          <input
            type="text"
            value={leftLabel}
            onChange={(e) => {
              setLeftLabel(e.target.value)
              handleUpdate()
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Set A"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Right Set Label
          </label>
          <input
            type="text"
            value={rightLabel}
            onChange={(e) => {
              setRightLabel(e.target.value)
              handleUpdate()
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Set B"
          />
        </div>
      </div>

      {/* Add new item */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Add Item
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem('center')}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter item text"
          />
          <button
            onClick={() => addItem('left')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            Add to {leftLabel}
          </button>
          <button
            onClick={() => addItem('center')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
          >
            Add to Intersection
          </button>
          <button
            onClick={() => addItem('right')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
          >
            Add to {rightLabel}
          </button>
        </div>
      </div>

      {/* Venn Diagram Display */}
      <div className="relative w-full max-w-2xl mx-auto mb-6">
        <svg viewBox="0 0 400 200" className="w-full h-auto">
          {/* Left circle */}
          <circle
            cx="150"
            cy="100"
            r="90"
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          {/* Right circle */}
          <circle
            cx="250"
            cy="100"
            r="90"
            fill="rgba(147, 51, 234, 0.2)"
            stroke="#9333EA"
            strokeWidth="2"
          />

          {/* Labels inside circles */}
          <text x="150" y="40" textAnchor="middle" className="fill-gray-800 font-semibold text-sm">
            {leftLabel}
          </text>
          <text x="250" y="40" textAnchor="middle" className="fill-gray-800 font-semibold text-sm">
            {rightLabel}
          </text>

          {/* Left circle items as bullet points - start from top left, go down */}
          {getItemsByPosition('left').map((item, index) => {
            // Position items vertically starting from top-left of left circle
            // Circle center: (150, 100), radius: 80
            // Start from top-left area: x around 85-90, y starting around 60
            const x = 85
            const startY = 60
            const y = startY + index * 14 // 14px spacing between items
            
            return (
              <g key={item.id}>
                <circle cx={x} cy={y} r="2.5" fill="#1e40af" />
                <text 
                  x={x + 6} 
                  y={y + 3} 
                  className="fill-gray-700"
                  style={{ fontSize: '11px' }}
                >
                  {item.text.length > 20 ? item.text.substring(0, 20) + '...' : item.text}
                </text>
              </g>
            )
          })}

          {/* Right circle items as bullet points - start from top left, go down */}
          {getItemsByPosition('right').map((item, index) => {
            // Position items vertically starting from upper-left of right circle,
            // clearly to the right of the center bullets so they don't overlap
            // Circle center: (250, 100), radius: 90
            const x = 240
            const startY = 60
            const y = startY + index * 14 // 14px spacing between items
            
            return (
              <g key={item.id}>
                <circle cx={x} cy={y} r="2.5" fill="#7c3aed" />
                <text 
                  x={x + 6} 
                  y={y + 3} 
                  className="fill-gray-700"
                  style={{ fontSize: '11px' }}
                >
                  {item.text.length > 20 ? item.text.substring(0, 20) + '...' : item.text}
                </text>
              </g>
            )
          })}

          {/* Center/Intersection items as bullet points - start from top, go down */}
          {getItemsByPosition('center').map((item, index) => {
            // Position items vertically in the intersection (center area)
            const x = 190
            const startY = 60
            const y = startY + index * 14 // 14px spacing between items
            
            return (
              <g key={item.id}>
                <circle cx={x} cy={y} r="2.5" fill="#059669" />
                <text 
                  x={x + 6} 
                  y={y + 3} 
                  className="fill-gray-700"
                  style={{ fontSize: '11px' }}
                >
                  {item.text.length > 20 ? item.text.substring(0, 20) + '...' : item.text}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Items list with controls */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{leftLabel} ({getItemsByPosition('left').length})</h3>
          <ul className="space-y-1 list-disc list-inside">
            {getItemsByPosition('left').map(item => (
              <li key={item.id} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                <span className="text-sm">{item.text}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveItem(item.id, 'center')}
                    className="text-xs px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                  >
                    →
                  </button>
                  <button
                    onClick={() => moveItem(item.id, 'right')}
                    className="text-xs px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded"
                  >
                    ≫
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Center ({getItemsByPosition('center').length})</h3>
          <ul className="space-y-1 list-disc list-inside">
            {getItemsByPosition('center').map(item => (
              <li key={item.id} className="flex items-center justify-between bg-green-50 p-2 rounded">
                <span className="text-sm">{item.text}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveItem(item.id, 'left')}
                    className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    ≪
                  </button>
                  <button
                    onClick={() => moveItem(item.id, 'right')}
                    className="text-xs px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded"
                  >
                    ≫
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{rightLabel} ({getItemsByPosition('right').length})</h3>
          <ul className="space-y-1 list-disc list-inside">
            {getItemsByPosition('right').map(item => (
              <li key={item.id} className="flex items-center justify-between bg-purple-50 p-2 rounded">
                <span className="text-sm">{item.text}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveItem(item.id, 'left')}
                    className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    ≪
                  </button>
                  <button
                    onClick={() => moveItem(item.id, 'center')}
                    className="text-xs px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
