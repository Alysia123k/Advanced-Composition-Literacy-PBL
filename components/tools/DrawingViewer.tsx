'use client'

import { useEffect, useState } from 'react'

interface DrawingViewerProps {
<<<<<<< HEAD
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
=======
  imageData?: {
    image: string
    comment?: string
  }
}

export default function DrawingViewer({ imageData }: DrawingViewerProps) {
  const [currentData, setCurrentData] = useState(imageData)

  useEffect(() => {
    if (imageData) {
      setCurrentData(imageData)
    }
  }, [imageData])

  if (!currentData?.image) {
>>>>>>> master
    return (
      <div className="text-gray-500 text-center py-4">
        No drawing yet
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">Drawing</h3>
<<<<<<< HEAD
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden inline-block">
        <img 
          src={currentImage} 
          alt="Student drawing" 
          className="max-w-full h-auto"
          key={currentImage?.substring(0, 50)} // Force re-render when image changes
        />
      </div>
=======
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden inline-block mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentData.image}
          alt="Student drawing"
          className="max-w-full h-auto"
          key={currentData.image?.substring(0, 50)} // Force re-render when image changes
        />
      </div>
      {currentData.comment && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Comment:</h4>
          <p className="text-sm text-gray-600">{currentData.comment}</p>
        </div>
      )}
>>>>>>> master
    </div>
  )
}


