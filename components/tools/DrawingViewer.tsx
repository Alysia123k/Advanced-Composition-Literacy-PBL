'use client'

import { useEffect, useState } from 'react'

interface DrawingViewerProps {
  imageData?: string
}

export default function DrawingViewer({ imageData }: DrawingViewerProps) {
  const [currentImage, setCurrentImage] = useState(imageData)

  useEffect(() => {
    if (imageData) {
      setCurrentImage(imageData)
    }
  }, [imageData])

  if (!currentImage) {
    return (
      <div className="text-gray-500 text-center py-4">
        No drawing yet
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">Drawing</h3>
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden inline-block">
        <img 
          src={currentImage} 
          alt="Student drawing" 
          className="max-w-full h-auto"
          key={currentImage?.substring(0, 50)} // Force re-render when image changes
        />
      </div>
    </div>
  )
}


