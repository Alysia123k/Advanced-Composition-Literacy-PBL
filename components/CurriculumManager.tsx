'use client'

import { useState } from 'react'

interface Unit {
  id: string
  title: string
  ask: string
  link: string
}

interface GradeData {
  [grade: string]: Unit[]
}

const gradeData: GradeData = {
  '6th': [
    {
      id: 'unit1',
      title: 'Unit 1: Celestial Objects from Different Perspectives',
      ask: 'Can you design a spaceship and explain what parts of the solar system it would reach? (ESSA1.B: Earth and the Solar System)',
      link: 'https://inspire.gadoe.org/collection/40.0610/92'
    },
    {
      id: 'unit2',
      title: 'Unit 2: Earth-Moon-Sun',
      ask: 'Can you make a diagram to explain how the tides affect the Earth\'s landscape? (ESSA1.B: Earth and the Solar System)',
      link: 'https://inspire.gadoe.org/collection/40.0610/93'
    },
    {
      id: 'unit3',
      title: 'Unit 3: Earth\'s Changing Landscape',
      ask: 'Can you create a new type of rock and explain how it is created based on the rock cycle? Make sure to name your new rock! (ESS2.A:Earth Materials and Systems)',
      link: 'https://inspire.gadoe.org/collection/40.0610/844'
    },
    {
      id: 'unit4',
      title: 'Unit 4: Water impacts on Earth\'s Surface',
      ask: 'Can you design a house that will survive water\'s erosion? (ESS2.C: The Roles of Water in Earth\'s Surface Processes)',
      link: 'https://inspire.gadoe.org/collection/40.0610/845'
    },
    {
      id: 'unit5',
      title: 'Unit 5: Climate and Weather',
      ask: 'Can you design a protection and warning system for people living near volcanoes? (ESS3.B: Natural Hazards)',
      link: 'https://inspire.gadoe.org/collection/40.0610/846'
    },
    {
      id: 'unit6',
      title: 'Unit 6: Human Energy Needs',
      ask: 'Can you design a system that targets greenhouse gases to protect the Earth from continual global warming? (ESS3.D: Global Climate Change)',
      link: 'https://inspire.gadoe.org/collection/40.0610/847'
    }
  ],
  '7th': [],
  '8th': []
}

export default function CurriculumManager() {
  const [selectedGrade, setSelectedGrade] = useState<string>('6th')

  const grades = ['6th', '7th', '8th']
  const units = gradeData[selectedGrade] || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Curriculum</h2>

        <div className="flex space-x-2 mb-6">
          {grades.map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedGrade === grade
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {grade} Grade
            </button>
          ))}
        </div>
      </div>

      {units.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            No units available for {selectedGrade} grade yet.
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {units.map((unit) => (
            <div key={unit.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {unit.title}
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {unit.ask}
              </p>
              <a
                href={unit.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Resources
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
