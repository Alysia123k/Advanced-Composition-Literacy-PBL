'use client'

import { useState, useEffect } from 'react'
import { Student, Classroom } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

interface DecisionMatrixToolProps {
  student: Student
  classroom: Classroom
  onUpdate: (data: any) => void
}

export default function DecisionMatrixTool({
  student,
  classroom,
  onUpdate,
}: DecisionMatrixToolProps) {
  const [data, setData] = useState(
    student.responses.decisionMatrix || {
      criteria: [],
      groupMembers: [],
    }
  )

  // Get group members
  useEffect(() => {
    if (student.groupId) {
      const group = classroom.groups.find(g => g.groupId === student.groupId)
      if (group) {
        const groupMembers = group.studentIds
          .map(id => classroom.students.find(s => s.studentId === id))
          .filter(Boolean)
          .map(s => s!.name)
        
        setData(prev => ({
          ...prev,
          groupMembers: groupMembers.length > 0 ? groupMembers : [student.name],
        }))
      } else {
        setData(prev => ({
          ...prev,
          groupMembers: [student.name],
        }))
      }
    } else {
      setData(prev => ({
        ...prev,
        groupMembers: [student.name],
      }))
    }
  }, [student.groupId, classroom, student.name])

  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdate(data)
    }, 300)
    return () => clearTimeout(timer)
  }, [data, onUpdate])

  const addCriterion = () => {
    setData(prev => ({
      ...prev,
      criteria: [
        ...prev.criteria,
        {
          id: uuidv4(),
          name: '',
          weight: 1,
          ratings: {},
        },
      ],
    }))
  }

  const updateCriterion = (id: string, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      criteria: prev.criteria.map(c =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }))
  }

  const updateRating = (criterionId: string, memberName: string, rating: number) => {
    setData(prev => ({
      ...prev,
      criteria: prev.criteria.map(c =>
        c.id === criterionId
          ? {
              ...c,
              ratings: { ...c.ratings, [memberName]: rating },
            }
          : c
      ),
    }))
  }

  const removeCriterion = (id: string) => {
    setData(prev => ({
      ...prev,
      criteria: prev.criteria.filter(c => c.id !== id),
    }))
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Decision Matrix</h2>
        <button
          onClick={addCriterion}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          + Add Criterion
        </button>
      </div>

      {data.groupMembers.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No group members assigned yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left font-semibold">Selection Criteria</th>
                <th className="border p-2 text-center font-semibold w-24">Weight</th>
                {data.groupMembers.map((member) => (
                  <th key={member} className="border p-2 text-center font-semibold">
                    {member}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.criteria.map((criterion) => (
                <tr key={criterion.id}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={criterion.name}
                      onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
                      placeholder="Enter criterion..."
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={criterion.weight}
                      onChange={(e) => {
                        const weight = parseFloat(e.target.value) || 0
                        if (!isNaN(weight)) {
                          updateCriterion(criterion.id, 'weight', weight)
                        }
                      }}
                      className="w-full px-2 py-1 border rounded text-center"
                      min="0"
                      step="0.1"
                    />
                  </td>
                  {data.groupMembers.map((member) => (
                    <td key={member} className="border p-2">
                      <input
                        type="number"
                        value={criterion.ratings[member] || ''}
                        onChange={(e) => {
                          const rating = parseFloat(e.target.value) || 0
                          if (!isNaN(rating)) {
                            updateRating(criterion.id, member, rating)
                          }
                        }}
                        className="w-full px-2 py-1 border rounded text-center"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0-10"
                      />
                      <div className="text-xs text-gray-600 mt-1 text-center">
                        Score: {calculateWeightedScore(criterion, member).toFixed(1)}
                      </div>
                    </td>
                  ))}
                  <td className="border p-2">
                    <button
                      onClick={() => removeCriterion(criterion.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </td>
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
                <td className="border p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


