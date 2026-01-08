# Classroom Collaboration Tool

An interactive classroom collaboration platform that allows teachers to host virtual classrooms where students can join, collaborate, and work on various educational tools in real-time.

## Features

### Teacher Features
- Create classrooms with unique join codes
- View all connected students in real-time
- Select and activate tools for students
- View student responses in real-time
- Manage groups (random or manual drag-and-drop)
- Push approved research links to students
- Answer private questions from students
- Print/export student work

### Student Features
- Join classrooms using a passcode
- Work on multiple tools simultaneously:
  - **Design Thinking Process**: Circular diagram with fill-in-the-blank stages
  - **Decision Matrix**: Weighted scoring matrix for group decisions
  - **Drawing Page**: Canvas for sketching ideas with multiple colors and thickness options
  - **Questions**: Respond to teacher questions
- Access research tab with pre-approved websites
- Ask private questions to teacher

### Tools

#### Design Thinking Process
- Circular process diagram with 5 stages: Connect & Define, Ideate, Create, Implement, Reflect & Improve
- Each stage has fill-in-the-blank text boxes
- Auto-saves as students type

#### Decision Matrix
- Add multiple selection criteria with weights
- Rate group members on each criterion
- Automatic weighted score calculation
- Highlights highest scorer
- Updates live as students type

#### Drawing Page
- Freehand drawing canvas
- 8 color options (Red, Blue, Green, Orange, Yellow, Brown, Black, White)
- 3 thickness levels (2px, 5px, 10px)
- Eraser tool
- Clear and export functionality
- Auto-saves drawings

#### Questions
- Teacher can post questions
- Students can respond
- All responses visible to teacher

## Tech Stack

- **Frontend**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Real-time**: Socket.io
- **Language**: TypeScript
- **Storage**: In-memory (ephemeral)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── page.tsx                 # Landing page
│   ├── teacher/
│   │   ├── dashboard/           # Teacher dashboard
│   │   └── classroom/[id]/     # Teacher classroom view
│   └── student/
│       ├── join/                # Student join page
│       └── classroom/[id]/      # Student classroom view
├── components/
│   ├── tools/                   # Tool components
│   ├── TeacherSidebar.tsx
│   ├── ToolSelector.tsx
│   ├── StudentViewer.tsx
│   ├── GroupManager.tsx
│   ├── ResearchManager.tsx
│   ├── PrivateQuestions.tsx
│   ├── ResearchTab.tsx
│   └── PrivateQuestionBox.tsx
├── lib/
│   ├── types.ts                 # TypeScript types
│   ├── store.ts                 # In-memory data store
│   └── useSocket.ts             # Socket.io hook
└── server.js                    # Custom server with Socket.io
```

## Usage

### For Teachers

1. Click "Teacher" on the landing page
2. Enter your name and create a classroom
3. Share the join code with students
4. Select tools from the tool selector to activate them for students
5. Click on student names in the left sidebar to view their work
6. Use the right panel to manage groups, research links, and answer questions

### For Students

1. Click "Student" on the landing page
2. Enter the join code and your name
3. Wait for teacher to activate tools
4. Work on the tools as they appear
5. Use the "Ask Teacher" button (bottom right) to ask private questions
6. Switch between "Activities" and "Research" tabs

## Data Privacy

- No user accounts, emails, or passwords required
- All data is stored in-memory (ephemeral)
- Data resets on server restart
- FERPA-safe design with no personal identifiers stored

## Limitations

- Data is ephemeral (lost on server restart)
- No database persistence
- Maximum recommended: 30 concurrent students per classroom
- Research links must be from pre-approved domains (.edu, .gov, wikipedia.org, etc.)

## License

This project is for educational use.


