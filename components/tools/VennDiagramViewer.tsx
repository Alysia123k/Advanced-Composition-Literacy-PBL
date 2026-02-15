'use client'

interface VennDiagramViewerProps {
  data?: {
    leftLabel: string
    rightLabel: string
    items: Array<{
      id: string
      text: string
      position: 'left' | 'right' | 'center'
    }>
  }
}

export default function VennDiagramViewer({ data }: VennDiagramViewerProps) {
  if (!data) {
    return (
      <div className="text-gray-500 text-center py-4">
        No Venn diagram data yet
      </div>
    )
  }

  const { leftLabel, rightLabel, items } = data

  const getItemsByPosition = (position: 'left' | 'right' | 'center') => {
    return items.filter(item => item.position === position)
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">Venn Diagram</h3>

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

      {/* Items list */}
      <div className="space-y-4">
        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-2">
            {leftLabel} ({getItemsByPosition('left').length} items)
          </h4>
          <ul className="space-y-1 list-disc list-inside">
            {getItemsByPosition('left').map(item => (
              <li key={item.id} className="bg-blue-50 p-2 rounded text-sm">
                {item.text}
              </li>
            ))}
            {getItemsByPosition('left').length === 0 && (
              <li className="text-gray-400 italic text-sm">No items</li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-2">
            Center ({getItemsByPosition('center').length} items)
          </h4>
          <ul className="space-y-1 list-disc list-inside">
            {getItemsByPosition('center').map(item => (
              <li key={item.id} className="bg-green-50 p-2 rounded text-sm">
                {item.text}
              </li>
            ))}
            {getItemsByPosition('center').length === 0 && (
              <li className="text-gray-400 italic text-sm">No items</li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-2">
            {rightLabel} ({getItemsByPosition('right').length} items)
          </h4>
          <ul className="space-y-1 list-disc list-inside">
            {getItemsByPosition('right').map(item => (
              <li key={item.id} className="bg-purple-50 p-2 rounded text-sm">
                {item.text}
              </li>
            ))}
            {getItemsByPosition('right').length === 0 && (
              <li className="text-gray-400 italic text-sm">No items</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
