'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Classroom Collaboration Tool
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Choose your role to get started
        </p>
        <div className="flex gap-8 justify-center">
          <Link
            href="/teacher/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white text-2xl font-semibold py-6 px-12 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Teacher
          </Link>
          <Link
            href="/student/join"
            className="bg-green-600 hover:bg-green-700 text-white text-2xl font-semibold py-6 px-12 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Student
          </Link>
        </div>
      </div>
    </div>
  )
}


