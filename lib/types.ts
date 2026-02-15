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
<<<<<<< HEAD
    drawing?: string // base64 image data
=======
    drawing?: {
      image: string // base64 image data
      comment?: string
    }
>>>>>>> master
    questions?: Array<{
      id: string
      question: string
      answer?: string
      timestamp: number
    }>
<<<<<<< HEAD
  }
}

=======
    vennDiagram?: {
      leftLabel: string
      rightLabel: string
      items: Array<{
        id: string
        text: string
        position: 'left' | 'right' | 'center'
      }>
    }
  }
}

export interface ClassroomQuestion {
  id: string
  question: string
  timestamp: number
}

>>>>>>> master
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
<<<<<<< HEAD
  questions: Array<{
    id: string
    question: string
    timestamp: number
  }>
}

export type ToolType = 
=======
  questions: ClassroomQuestion[]
}

export type ToolType =
>>>>>>> master
  | 'designThinking'
  | 'decisionMatrix'
  | 'drawing'
  | 'questions'
<<<<<<< HEAD
=======
  | 'vennDiagram'
  | 'graph'
>>>>>>> master


