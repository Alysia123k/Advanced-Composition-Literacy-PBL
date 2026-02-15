import { Classroom, Student } from './types'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'

<<<<<<< HEAD
// File path for persistence
const STORE_FILE = path.join(process.cwd(), 'classrooms.json')

// In-memory storage
const classrooms = new Map<string, Classroom>()

// Load classrooms from file
function loadClassrooms() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf8')
      const classroomsData = JSON.parse(data)
      for (const [id, classroom] of Object.entries(classroomsData)) {
        classrooms.set(id, classroom as Classroom)
      }
      console.log(`[Store] Loaded ${classrooms.size} classrooms from file`)
    }
  } catch (error) {
    console.error('[Store] Error loading classrooms:', error)
  }
}

// Save classrooms to file
function saveClassrooms() {
=======
// File path for persistence (used only when writable, e.g. local dev)
const STORE_FILE = path.join(process.cwd(), 'classrooms.json')

// Maximum students per classroom (supports at least 40, up to 100+ for Vercel/multi-student)
export const MAX_STUDENTS = 100

// Global in-memory store so Vercel serverless reuses the same data across requests in a worker.
// On Vercel the filesystem is read-only, so we rely on this; file is used only when writable.
declare global {
  // eslint-disable-next-line no-var
  var __classroomsStore: Map<string, Classroom> | undefined
}

function getGlobalStore(): Map<string, Classroom> {
  if (typeof globalThis.__classroomsStore === 'undefined') {
    globalThis.__classroomsStore = new Map<string, Classroom>()
    // Seed from file once if it exists (e.g. local dev)
    try {
      if (fs.existsSync(STORE_FILE)) {
        const data = fs.readFileSync(STORE_FILE, 'utf8')
        const classroomsData = JSON.parse(data)
        for (const [id, classroom] of Object.entries(classroomsData)) {
          globalThis.__classroomsStore.set(id, classroom as Classroom)
        }
        console.log('[Store] Seeded from file:', globalThis.__classroomsStore.size, 'classrooms')
      }
    } catch (e) {
      console.error('[Store] Error seeding from file:', e)
    }
  }
  return globalThis.__classroomsStore
}

// Load classrooms (always returns the same global map)
function loadClassrooms(): Map<string, Classroom> {
  return getGlobalStore()
}

// Save: keep in-memory (already in global map); try to persist to file (fails on Vercel, ok)
function saveClassrooms(classrooms: Map<string, Classroom>) {
>>>>>>> master
  try {
    const classroomsData = Object.fromEntries(classrooms)
    fs.writeFileSync(STORE_FILE, JSON.stringify(classroomsData, null, 2))
  } catch (error) {
<<<<<<< HEAD
    console.error('[Store] Error saving classrooms:', error)
  }
}

// Load on module import
loadClassrooms()

// Debug function to get all classrooms (development only)
export function getAllClassrooms(): Classroom[] {
=======
    // Expected on Vercel (read-only fs); in-memory store is still used
  }
}

// Debug function to get all classrooms (development only)
export function getAllClassrooms(): Classroom[] {
  const classrooms = loadClassrooms()
>>>>>>> master
  return Array.from(classrooms.values())
}

export function createClassroom(teacherName: string): Classroom {
<<<<<<< HEAD
=======
  const classrooms = loadClassrooms()
>>>>>>> master
  const classroomId = uuidv4()
  // Generate a unique 6-character uppercase alphanumeric code
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
<<<<<<< HEAD
  saveClassrooms()
=======
  saveClassrooms(classrooms)
>>>>>>> master
  console.log(`[Store] Created classroom: ${classroomId}, Join Code: ${joinCode}, Total classrooms: ${classrooms.size}`)
  return classroom
}

export function getClassroom(classroomId: string): Classroom | undefined {
<<<<<<< HEAD
  return classrooms.get(classroomId)
}

export function getClassroomByCode(joinCode: string): Classroom | undefined {
=======
  const classrooms = loadClassrooms()
  console.log(`[Store] Getting classroom by ID: "${classroomId}"`)
  console.log(`[Store] Available classroom IDs:`, Array.from(classrooms.keys()))
  const classroom = classrooms.get(classroomId)
  console.log(`[Store] Classroom found:`, !!classroom)
  if (classroom) {
    console.log(`[Store] Classroom details: ID=${classroom.classroomId}, Teacher=${classroom.teacherName}, JoinCode=${classroom.joinCode}`)
  }
  return classroom
}

export function getClassroomByCode(joinCode: string): Classroom | undefined {
  const classrooms = loadClassrooms()
>>>>>>> master
  const normalizedCode = joinCode.toUpperCase().trim()
  console.log(`[Store] Looking for join code: "${normalizedCode}", Total classrooms: ${classrooms.size}`)
  for (const classroom of Array.from(classrooms.values())) {
    console.log(`[Store] Checking classroom: ${classroom.joinCode} (${classroom.teacherName})`)
    if (classroom.joinCode.toUpperCase() === normalizedCode) {
      console.log(`[Store] Found matching classroom: ${classroom.classroomId}`)
      return classroom
    }
  }
  console.log(`[Store] No classroom found for code: "${normalizedCode}"`)
  return undefined
}

export function addStudent(classroomId: string, studentName: string): Student | null {
<<<<<<< HEAD
  const classroom = classrooms.get(classroomId)
  if (!classroom) return null
  
  // Check for duplicate names
  if (classroom.students.some(s => s.name.toLowerCase() === studentName.toLowerCase())) {
    return null
  }
  
=======
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return null

  if (classroom.students.length >= MAX_STUDENTS) return null

  // Check for duplicate names
  if (classroom.students.some((s: Student) => s.name.toLowerCase() === studentName.toLowerCase())) {
    return null
  }

>>>>>>> master
  const student: Student = {
    studentId: uuidv4(),
    name: studentName,
    responses: {},
  }
<<<<<<< HEAD
  
  classroom.students.push(student)
  saveClassrooms()
=======

  classroom.students.push(student)
  saveClassrooms(classrooms)
>>>>>>> master
  return student
}

export function updateStudentResponse(
  classroomId: string,
  studentId: string,
  toolType: string,
  data: any
) {
<<<<<<< HEAD
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false
  
  const student = classroom.students.find(s => s.studentId === studentId)
  if (!student) return false
  
=======
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const student = classroom.students.find((s: Student) => s.studentId === studentId)
  if (!student) return false

>>>>>>> master
  // Handle different tool types appropriately
  if (toolType === 'questions') {
    // For questions, replace the entire array (it's already a complete array from the tool)
    (student.responses as any)[toolType] = data.questions || data
  } else if (toolType === 'drawing') {
<<<<<<< HEAD
    // For drawing, it's a string (base64 image), so just assign it
    (student.responses as any)[toolType] = data
  } else {
    // For other types (designThinking, decisionMatrix), merge the data
=======
    // For drawing, it's an object with image and comment
    (student.responses as any)[toolType] = data
  } else {
    // For other types (designThinking, decisionMatrix, vennDiagram), merge the data
>>>>>>> master
    if (!student.responses[toolType as keyof typeof student.responses]) {
      (student.responses as any)[toolType] = {}
    }
    Object.assign((student.responses as any)[toolType], data)
  }
<<<<<<< HEAD
  
  saveClassrooms()
=======

  saveClassrooms(classrooms)
>>>>>>> master
  return true
}

export function toggleTool(classroomId: string, toolType: string) {
<<<<<<< HEAD
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false
  
=======
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

>>>>>>> master
  const index = classroom.activeTools.indexOf(toolType)
  if (index > -1) {
    classroom.activeTools.splice(index, 1)
  } else {
    classroom.activeTools.push(toolType)
  }
<<<<<<< HEAD
=======
  // Persist tool changes so they survive server restarts
  saveClassrooms(classrooms)
>>>>>>> master
  return true
}

export function createGroups(classroomId: string, groupSize: number, random: boolean = true) {
<<<<<<< HEAD
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false
  
=======
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

>>>>>>> master
  const students = [...classroom.students]
  if (random) {
    // Shuffle array
    for (let i = students.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [students[i], students[j]] = [students[j], students[i]]
    }
  }
<<<<<<< HEAD
  
=======

>>>>>>> master
  classroom.groups = []
  for (let i = 0; i < students.length; i += groupSize) {
    const group = students.slice(i, i + groupSize)
    const groupId = uuidv4()
    classroom.groups.push({
      groupId,
<<<<<<< HEAD
      studentIds: group.map(s => s.studentId),
    })
    group.forEach(student => {
      student.groupId = groupId
    })
  }
  
=======
      studentIds: group.map((s: Student) => s.studentId),
    })
    group.forEach((student: Student) => {
      student.groupId = groupId
    })
  }

  // Persist group changes
  saveClassrooms(classrooms)
>>>>>>> master
  return true
}

export function updateGroups(classroomId: string, groups: Array<{ groupId: string; studentIds: string[] }>) {
<<<<<<< HEAD
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false
  
  classroom.groups = groups
  classroom.students.forEach(student => {
    const group = groups.find(g => g.studentIds.includes(student.studentId))
    student.groupId = group?.groupId
  })
  
=======
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  classroom.groups = groups
  classroom.students.forEach((student: Student) => {
    const group = groups.find(g => g.studentIds.includes(student.studentId))
    student.groupId = group?.groupId
  })

  // Persist manual group updates
  saveClassrooms(classrooms)
>>>>>>> master
  return true
}

export function addResearchLink(classroomId: string, url: string) {
<<<<<<< HEAD
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false
  
  if (!classroom.researchLinks.includes(url)) {
    classroom.researchLinks.push(url)
  }
=======
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  if (!classroom.researchLinks.includes(url)) {
    classroom.researchLinks.push(url)
  }
  // Persist research link changes
  saveClassrooms(classrooms)
>>>>>>> master
  return true
}

export function removeResearchLink(classroomId: string, url: string) {
<<<<<<< HEAD
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false
  
=======
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

>>>>>>> master
  const index = classroom.researchLinks.indexOf(url)
  if (index > -1) {
    classroom.researchLinks.splice(index, 1)
  }
<<<<<<< HEAD
=======
  // Persist research link removal
  saveClassrooms(classrooms)
>>>>>>> master
  return true
}

export function addTeacherQuestion(classroomId: string, question: string) {
<<<<<<< HEAD
=======
  const classrooms = loadClassrooms()
>>>>>>> master
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  classroom.questions.push({
    id: uuidv4(),
    question,
    timestamp: Date.now(),
  })
<<<<<<< HEAD
  saveClassrooms()
=======
  saveClassrooms(classrooms)
>>>>>>> master
  return true
}

export function editTeacherQuestion(classroomId: string, questionId: string, question: string) {
<<<<<<< HEAD
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const questionIndex = classroom.questions.findIndex(q => q.id === questionId)
  if (questionIndex === -1) return false

  classroom.questions[questionIndex].question = question
  saveClassrooms()
=======
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const questionIndex = classroom.questions.findIndex((q: any) => q.id === questionId)
  if (questionIndex === -1) return false

  classroom.questions[questionIndex].question = question
  saveClassrooms(classrooms)
>>>>>>> master
  return true
}

export function deleteTeacherQuestion(classroomId: string, questionId: string) {
<<<<<<< HEAD
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const questionIndex = classroom.questions.findIndex(q => q.id === questionId)
  if (questionIndex === -1) return false

  classroom.questions.splice(questionIndex, 1)
  saveClassrooms()
=======
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const questionIndex = classroom.questions.findIndex((q: any) => q.id === questionId)
  if (questionIndex === -1) return false

  classroom.questions.splice(questionIndex, 1)
  saveClassrooms(classrooms)
>>>>>>> master
  return true
}

export function answerTeacherQuestion(classroomId: string, studentId: string, questionId: string, answer: string) {
<<<<<<< HEAD
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const student = classroom.students.find(s => s.studentId === studentId)
=======
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const student = classroom.students.find((s: Student) => s.studentId === studentId)
>>>>>>> master
  if (!student) return false

  if (!student.responses.questions) {
    student.responses.questions = []
  }

<<<<<<< HEAD
  const existingAnswer = student.responses.questions.find(q => q.id === questionId)
=======
  const existingAnswer = student.responses.questions.find((q: any) => q.id === questionId)
>>>>>>> master
  if (existingAnswer) {
    existingAnswer.answer = answer
  } else {
    student.responses.questions.push({
      id: questionId,
<<<<<<< HEAD
      question: classroom.questions.find(q => q.id === questionId)?.question || '',
=======
      question: classroom.questions.find((q: any) => q.id === questionId)?.question || '',
>>>>>>> master
      answer,
      timestamp: Date.now(),
    })
  }
<<<<<<< HEAD
  saveClassrooms()
=======
  saveClassrooms(classrooms)
>>>>>>> master
  return true
}

export function addStudentQuestion(classroomId: string, studentId: string, question: string) {
<<<<<<< HEAD
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const student = classroom.students.find(s => s.studentId === studentId)
=======
  const classrooms = loadClassrooms()
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const student = classroom.students.find((s: Student) => s.studentId === studentId)
>>>>>>> master
  if (!student) return false

  if (!student.responses.questions) {
    student.responses.questions = []
  }

  // Add the student's private question
  student.responses.questions.push({
    id: uuidv4(),
    question,
    timestamp: Date.now(),
  })

<<<<<<< HEAD
  saveClassrooms()
  return true
}

=======
  saveClassrooms(classrooms)
  return true
}
>>>>>>> master
