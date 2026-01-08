'use client'

import { useState } from 'react'

interface ResearchManagerProps {
  researchLinks: string[]
  onAddLink: (url: string) => void
  onRemoveLink: (url: string) => void
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export default function ResearchManager({
  researchLinks,
  onAddLink,
  onRemoveLink,
}: ResearchManagerProps) {
  const [newUrl, setNewUrl] = useState('')
  const [error, setError] = useState('')

  const handleAdd = () => {
    setError('')
    if (!newUrl.trim()) {
      setError('Please enter a URL')
      return
    }

    let url = newUrl.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL')
      return
    }

    onAddLink(url)
    setNewUrl('')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Research Links</h3>
      <div className="space-y-2 mb-3">
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add research URL"
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
        {error && (
          <div className="text-red-600 text-xs">{error}</div>
        )}
        <button
          onClick={handleAdd}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold"
        >
          Add Link
        </button>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {researchLinks.map((link, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
          >
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate flex-1"
            >
              {link}
            </a>
            <button
              onClick={() => onRemoveLink(link)}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}


