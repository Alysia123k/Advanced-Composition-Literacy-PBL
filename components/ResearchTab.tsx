'use client'

interface ResearchTabProps {
  researchLinks: string[]
}

export default function ResearchTab({ researchLinks }: ResearchTabProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Research</h2>
      {researchLinks.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-xl">
          No research links available yet. Teacher will add approved websites.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {researchLinks.map((link, index) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-blue-200 hover:border-blue-400"
            >
              <div className="font-semibold text-blue-600 mb-1">
                {new URL(link).hostname}
              </div>
              <div className="text-sm text-gray-600 truncate">{link}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}


