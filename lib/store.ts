import { Classroom, Student } from './types'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'

// File path for persistence (used only when writable, e.g. local dev)
const STORE_FILE = path.join(process.cwd(), 'classrooms.json')

// Maximum students per classroom (supports at least 40, up to 100+ for Vercel/multi-student)
export const MAX_STUDENTS = 100

// Global in-memory store so Vercel serverless reuses the same data across requests in a worker.
// On Vercel the filesystem is read-only, so we rely on this; file is used only when writable.
function getGlobalStore(): Map<string, Classroom> {
  const g = globalThis as typeof globalThis & { __classroomsStore?: Map<string, Classroom> }
  if (typeof g.__classroomsStore === 'undefined') {
    g.__classroomsStore = new Map<string, Classroom>()
    try {
      if (fs.existsSync(STORE_FILE)) {
        const data = fs.readFileSync(STORE_FILE, 'utf8')
        const classroomsData = JSON.parse(data)
        for (const [id, classroom] of Object.entries(classroomsData)) {
          g.__classroomsStore.set(id, classroom as Classroom)
        }
        console.log('[Store] Seeded from file:', g.__classroomsStore.size, 'classrooms')
      }
    } catch (e) {
      console.error('[Store] Error seeding from file:', e)
    }
  }
  return g.__classroomsStore
}

function loadClassrooms(): Map<string, Classroom> {
  return getGlobalStore()
}

function saveClassrooms(classrooms: Map<string, Classroom>) {
  try {
    const classroomsData = Object.fromEntries(classrooms)
    fs.writeFileSync(STORE_FILE, JSON.stringify(classroomsData, null, 2))
  } catch {
    // Expected on Vercel (read-only fs); in-memory store is still used
  }
}

export function getAllClassrooms(): Classroom[] {
  const classrooms = loadClassrooms()
  return Array.from(classrooms.values())
}

export function createClassroom(teacherName: string): Classroom {
  const classrooms = loadClassrooms()
  const classroomId = uuidv4()
  let joinCode = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const existingCodes = new Set(Array.from(classrooms.values()).map(c => c.joinCode))
  do {
    joinCode = ''
    for (let i = 0; i < 6; i++) {
      joinCode += chars.charAt(Math.floor(Math.random() * chars.length))
    }
  } while (existingCodes.has(joinCode))

  const classroom: Classroom = {
    classroomId,
    teacherName,
    joinCode,
    activeTools: [],
    students: [],
    groups: [],
    researchLinks: [],
    questions: [],
  }

  classrooms.set(classroomId, classroom)
  saveClassrooms(classrooms)
  console.log('[Store] Created classroom: ', classroomId, ' Join Code: ', joinCode)
  return classroom
}

export function getClassroom(classroomId: string): Classroom | undefined {
  const classrooms = loadClassrooms()
  return classrooms.get(classroomId)
}

export function getClassroomByCode(joinCode: string): Classroom | undefined {
  const classrooms = loadClassrooms()
  const normalizedCode = joinCode.toUpperCase().trim()
  for (const classroom of Array.from(classrooms.values())) {
    if (classroom.joinCode.toUpperCase() === normalizedCode) {
      return classroom
    }
  }
  return undefined
}

export function addStudent(classroomId: string, studentName: string): Student | null {
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return null

  if (classroom.students.length >= MAX_STUDENTS) return null

  if (classroom.students.some((s: Student) => s.name.toLowerCase() === studentName.toLowerCase())) {
    return null
  }

  const student: Student = {
    studentId: uuidv4(),
    name: studentName,
    responses: {},
  }

  classroom.students.push(student)
  saveClassrooms(classrooms)
  return student
}

export function updateStudentResponse(
  classroomId: string,
  studentId: string,
  toolType: string,
  data: any
) {
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const student = classroom.students.find((s: Student) => s.studentId === studentId)
  if (!student) return false

  if (toolType === 'questions') {
    (student.responses as any)[toolType] = data.questions || data
  } else if (toolType === 'drawing') {
    (student.responses as any)[toolType] = data
  } else {
    if (!student.responses[toolType as keyof typeof student.responses]) {
      (student.responses as any)[toolType] = {}
    }
    Object.assign((student.responses as any)[toolType], data)
  }

  saveClassrooms(classrooms)
  return true
}

export function toggleTool(classroomId: string, toolType: string) {
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const index = classroom.activeTools.indexOf(toolType)
  if (index > -1) {
    classroom.activeTools.splice(index, 1)
  } else {
    classroom.activeTools.push(toolType)
  }
  saveClassrooms(classrooms)
  return true
}

export function createGroups(classroomId: string, groupSize: number, random: boolean = true) {
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const students = [...classroom.students]
  if (random) {
    for (let i = students.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [students[i], students[j]] = [students[j], students[i]]
    }
  }

  classroom.groups = []
  for (let i = 0; i < students.length; i += groupSize) {
    const group = students.slice(i, i + groupSize)
    const groupId = uuidv4()
    classroom.groups.push({
      groupId,
      studentIds: group.map((s: Student) => s.studentId),
    })
    group.forEach((student: Student) => {
      student.groupId = groupId
    })
  }
  saveClassrooms(classrooms)
  return true
}

export function updateGroups(classroomId: string, groups: Array<{ groupId: string; studentIds: string[] }>) {
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  classroom.groups = groups
  classroom.students.forEach((student: Student) => {
    const group = groups.find(g => g.studentIds.includes(student.studentId))
    student.groupId = group?.groupId
  })
  saveClassrooms(classrooms)
  return true
}

export function addResearchLink(classroomId: string, url: string) {
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  if (!classroom.researchLinks.includes(url)) {
    classroom.researchLinks.push(url)
  }
  saveClassrooms(classrooms)
  return true
}

export function removeResearchLink(classroomId: string, url: string) {
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const index = classroom.researchLinks.indexOf(url)
  if (index > -1) {
    classroom.researchLinks.splice(index, 1)
  }
  saveClassrooms(classrooms)
  return true
}

export function addTeacherQuestion(classroomId: string, question: string) {
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  classroom.questions.push({
    id: uuidv4(),
    question,
    timestamp: Date.now(),
  })
  saveClassrooms(classrooms)
  return true
}

export function editTeacherQuestion(classroomId: string, questionId: string, question: string) {
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const questionIndex = classroom.questions.findIndex((q: any) => q.id === questionId)
  if (questionIndex === -1) return false

  classroom.questions[questionIndex].question = question
  saveClassrooms(classrooms)
  return true
}

export function deleteTeacherQuestion(classroomId: string, questionId: string) {
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const questionIndex = classroom.questions.findIndex((q: any) => q.id === questionId)
  if (questionIndex === -1) return false

  classroom.questions.splice(questionIndex, 1)
  saveClassrooms(classrooms)
  return true
}

export function answerTeacherQuestion(classroomId: string, studentId: string, questionId: string, answer: string) {
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const student = classroom.students.find((s: Student) => s.studentId === studentId)
  if (!student) return false

  if (!student.responses.questions) {
    student.responses.questions = []
  }

  const existingAnswer = student.responses.questions.find((q: any) => q.id === questionId)
  if (existingAnswer) {
    existingAnswer.answer = answer
  } else {
    student.responses.questions.push({
      id: questionId,
      question: classroom.questions.find((q: any) => q.id === questionId)?.question || '',
      answer,
      timestamp: Date.now(),
    })
  }
  saveClassrooms(classrooms)
  return true
}

export function addStudentQuestion(classroomId: string, studentId: string, question: string) {
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const student = classroom.students.find((s: Student) => s.studentId === studentId)
  if (!student) return false

  if (!student.responses.questions) {
    student.responses.questions = []
  }

  student.responses.questions.push({
    id: uuidv4(),
    question,
    timestamp: Date.now(),
  })

  saveClassrooms(classrooms)
  return true
}
