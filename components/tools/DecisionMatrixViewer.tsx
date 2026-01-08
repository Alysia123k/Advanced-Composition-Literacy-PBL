'use client'

interface DecisionMatrixViewerProps {
  data?: {
    criteria: Array<{
      id: string
      name: string
      weight: number
      ratings: Record<string, number>
    }>
    groupMembers: string[]
  }
}

export default function DecisionMatrixViewer({ data }: DecisionMatrixViewerProps) {
  if (!data || data.criteria.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No decision matrix data yet
      </div>
    )
  }

  const calculateWeightedScore = (criterion: any, memberName: string) => {
    const rating = criterion.ratings[memberName] || 0
    return rating * criterion.weight
  }

  const calculateTotal = (memberName: string) => {
    return data.criteria.reduce((sum, criterion) => {
      return sum + calculateWeightedScore(criterion, memberName)
    }, 0)
  }

  const getHighestScorer = () => {
    if (data.groupMembers.length === 0) return null
    const totals = data.groupMembers.map(name => ({
      name,
      total: calculateTotal(name),
    }))
    return totals.reduce((max, curr) =>
      curr.total > max.total ? curr : max
    )
  }

  const highestScorer = getHighestScorer()

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4">Decision Matrix</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Criteria</th>
              <th className="border p-2 text-center">Weight</th>
              {data.groupMembers.map((member) => (
                <th key={member} className="border p-2 text-center">
                  {member}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.criteria.map((criterion) => (
              <tr key={criterion.id}>
                <td className="border p-2">{criterion.name || '(Unnamed)'}</td>
                <td className="border p-2 text-center">{criterion.weight}</td>
                {data.groupMembers.map((member) => (
                  <td key={member} className="border p-2 text-center">
                    <div>Rating: {criterion.ratings[member] || 0}</div>
                    <div className="text-xs text-gray-600">
                      Score: {calculateWeightedScore(criterion, member).toFixed(1)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="border p-2">Total</td>
              <td className="border p-2"></td>
              {data.groupMembers.map((member) => {
                const total = calculateTotal(member)
                const isHighest = highestScorer?.name === member
                return (
                  <td
                    key={member}
                    className={`border p-2 text-center ${
                      isHighest ? 'bg-yellow-200 font-bold' : ''
                    }`}
                  >
                    {total.toFixed(1)}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}


