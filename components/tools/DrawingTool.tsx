'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Student } from '@/lib/types'

interface DrawingToolProps {
  student: Student
  onUpdate: (data: any) => void
}

const colors = [
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Brown', value: '#92400E' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
]

const thicknesses = [2, 5, 10]

export default function DrawingTool({ student, onUpdate }: DrawingToolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [selectedThickness, setSelectedThickness] = useState(5)
  const [isErasing, setIsErasing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Load saved drawing
    if (student.responses.drawing) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
      }
      img.src = student.responses.drawing
    } else {
      // Initialize white background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [student.responses.drawing])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (isErasing) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = selectedThickness * 2
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = selectedColor
      ctx.lineWidth = selectedThickness
    }

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.beginPath()

    // Auto-save
    const dataUrl = canvas.toDataURL('image/png')
    onUpdate(dataUrl)
  }

  // Throttled save function for real-time updates
  const throttledSave = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL('image/png')
    onUpdate(dataUrl)
  }, [onUpdate])

  // Also save while drawing (throttled)
  useEffect(() => {
    if (!isDrawing) return

    const timer = setTimeout(() => {
      throttledSave()
    }, 1000) // Save every second while drawing

    return () => clearTimeout(timer)
  }, [isDrawing, throttledSave])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    onUpdate(canvas.toDataURL('image/png'))
  }

  const exportImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `drawing-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Drawing Page</h2>
        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Clear
          </button>
          <button
            onClick={exportImage}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Export
          </button>
        </div>
      </div>

      <div className="mb-4 space-y-3">
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-2">Colors</div>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  setSelectedColor(color.value)
                  setIsErasing(false)
                }}
                className={`w-12 h-12 rounded-lg border-4 ${
                  selectedColor === color.value && !isErasing
                    ? 'border-blue-600'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-700 mb-2">Thickness</div>
          <div className="flex gap-2">
            {thicknesses.map((thickness) => (
              <button
                key={thickness}
                onClick={() => setSelectedThickness(thickness)}
                className={`px-4 py-2 rounded-lg border-2 font-semibold ${
                  selectedThickness === thickness
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                {thickness}px
              </button>
            ))}
          </div>
        </div>

        <div>
          <button
            onClick={() => setIsErasing(!isErasing)}
            className={`px-4 py-2 rounded-lg border-2 font-semibold ${
              isErasing
                ? 'border-red-600 bg-red-50 text-red-700'
                : 'border-gray-300 text-gray-700'
            }`}
          >
            {isErasing ? 'Erasing' : 'Eraser'}
          </button>
        </div>
      </div>

      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair bg-white"
        />
      </div>
    </div>
  )
}


