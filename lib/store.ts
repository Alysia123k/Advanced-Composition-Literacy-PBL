import { Classroom, Student } from './types'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'

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
  try {
    const classroomsData = Object.fromEntries(classrooms)
    fs.writeFileSync(STORE_FILE, JSON.stringify(classroomsData, null, 2))
  } catch (error) {
    console.error('[Store] Error saving classrooms:', error)
  }
}

// Load on module import
loadClassrooms()

// Debug function to get all classrooms (development only)
export function getAllClassrooms(): Classroom[] {
  return Array.from(classrooms.values())
}

export function createClassroom(teacherName: string): Classroom {
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
  saveClassrooms()
  console.log(`[Store] Created classroom: ${classroomId}, Join Code: ${joinCode}, Total classrooms: ${classrooms.size}`)
  return classroom
}

export function getClassroom(classroomId: string): Classroom | undefined {
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
  const classroom = classrooms.get(classroomId)
  if (!classroom) return null
  
  // Check for duplicate names
  if (classroom.students.some(s => s.name.toLowerCase() === studentName.toLowerCase())) {
    return null
  }
  
  const student: Student = {
    studentId: uuidv4(),
    name: studentName,
    responses: {},
  }
  
  classroom.students.push(student)
  saveClassrooms()
  return student
}

export function updateStudentResponse(
  classroomId: string,
  studentId: string,
  toolType: string,
  data: any
) {
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false
  
  const student = classroom.students.find(s => s.studentId === studentId)
  if (!student) return false
  
  // Handle different tool types appropriately
  if (toolType === 'questions') {
    // For questions, replace the entire array (it's already a complete array from the tool)
    (student.responses as any)[toolType] = data.questions || data
  } else if (toolType === 'drawing') {
    // For drawing, it's a string (base64 image), so just assign it
    (student.responses as any)[toolType] = data
  } else {
    // For other types (designThinking, decisionMatrix), merge the data
    if (!student.responses[toolType as keyof typeof student.responses]) {
      (student.responses as any)[toolType] = {}
    }
    Object.assign((student.responses as any)[toolType], data)
  }
  
  saveClassrooms()
  return true
}

export function toggleTool(classroomId: string, toolType: string) {
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false
  
  const index = classroom.activeTools.indexOf(toolType)
  if (index > -1) {
    classroom.activeTools.splice(index, 1)
  } else {
    classroom.activeTools.push(toolType)
  }
  // Persist tool changes so they survive server restarts
  saveClassrooms()
  return true
}

export function createGroups(classroomId: string, groupSize: number, random: boolean = true) {
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false
  
  const students = [...classroom.students]
  if (random) {
    // Shuffle array
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
      studentIds: group.map(s => s.studentId),
    })
    group.forEach(student => {
      student.groupId = groupId
    })
  }
  
  // Persist group changes
  saveClassrooms()
  return true
}

export function updateGroups(classroomId: string, groups: Array<{ groupId: string; studentIds: string[] }>) {
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false
  
  classroom.groups = groups
  classroom.students.forEach(student => {
    const group = groups.find(g => g.studentIds.includes(student.studentId))
    student.groupId = group?.groupId
  })
  
  // Persist manual group updates
  saveClassrooms()
  return true
}

export function addResearchLink(classroomId: string, url: string) {
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false
  
  if (!classroom.researchLinks.includes(url)) {
    classroom.researchLinks.push(url)
  }
  // Persist research link changes
  saveClassrooms()
  return true
}

export function removeResearchLink(classroomId: string, url: string) {
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false
  
  const index = classroom.researchLinks.indexOf(url)
  if (index > -1) {
    classroom.researchLinks.splice(index, 1)
  }
  // Persist research link removal
  saveClassrooms()
  return true
}

export function addTeacherQuestion(classroomId: string, question: string) {
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  classroom.questions.push({
    id: uuidv4(),
    question,
    timestamp: Date.now(),
  })
  saveClassrooms()
  return true
}

export function editTeacherQuestion(classroomId: string, questionId: string, question: string) {
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const questionIndex = classroom.questions.findIndex(q => q.id === questionId)
  if (questionIndex === -1) return false

  classroom.questions[questionIndex].question = question
  saveClassrooms()
  return true
}

export function deleteTeacherQuestion(classroomId: string, questionId: string) {
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const questionIndex = classroom.questions.findIndex(q => q.id === questionId)
  if (questionIndex === -1) return false

  classroom.questions.splice(questionIndex, 1)
  saveClassrooms()
  return true
}

export function answerTeacherQuestion(classroomId: string, studentId: string, questionId: string, answer: string) {
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const student = classroom.students.find(s => s.studentId === studentId)
  if (!student) return false

  if (!student.responses.questions) {
    student.responses.questions = []
  }

  const existingAnswer = student.responses.questions.find(q => q.id === questionId)
  if (existingAnswer) {
    existingAnswer.answer = answer
  } else {
    student.responses.questions.push({
      id: questionId,
      question: classroom.questions.find(q => q.id === questionId)?.question || '',
      answer,
      timestamp: Date.now(),
    })
  }
  saveClassrooms()
  return true
}

export function addStudentQuestion(classroomId: string, studentId: string, question: string) {
  const classroom = classrooms.get(classroomId)
  if (!classroom) return false

  const student = classroom.students.find(s => s.studentId === studentId)
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

  saveClassrooms()
  return true
}

