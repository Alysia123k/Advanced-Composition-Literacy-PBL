export interface Student {
  studentId: string
  name: string
  groupId?: string
  responses: {
    designThinking?: {
      connectDefine?: string
      ideate?: string
      create?: string
      implement?: string
      reflectImprove?: string
    }
    decisionMatrix?: {
      criteria: Array<{
        id: string
        name: string
        weight: number
        ratings: Record<string, number>
      }>
      groupMembers: string[]
    }
    drawing?: string // base64 image data
    questions?: Array<{
      id: string
      question: string
      answer?: string
      timestamp: number
    }>
  }
}

export interface Classroom {
  classroomId: string
  teacherName: string
  joinCode: string
  activeTools: string[]
  students: Student[]
  groups: Array<{
    groupId: string
    studentIds: string[]
  }>
  researchLinks: string[]
  questions: Array<{
    id: string
    question: string
    timestamp: number
  }>
}

export type ToolType = 
  | 'designThinking'
  | 'decisionMatrix'
  | 'drawing'
  | 'questions'


