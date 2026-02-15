const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
<<<<<<< HEAD
const hostname = 'localhost'
const port = 3000
=======
const hostname = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'
const port = process.env.PORT || 3000
>>>>>>> master

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

<<<<<<< HEAD
=======
  // Make io instance globally available for API routes
  global.io = io

>>>>>>> master
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    socket.on('join-classroom', ({ classroomId, role, studentId }) => {
      socket.join(`classroom-${classroomId}`)
      if (role === 'student' && studentId) {
        socket.join(`student-${studentId}`)
      }
    })

<<<<<<< HEAD
    socket.on('student-joined', ({ classroomId }) => {
      socket.to(`classroom-${classroomId}`).emit('student-list-updated')
    })
=======

>>>>>>> master

    socket.on('tool-toggled', ({ classroomId, toolType }) => {
      socket.to(`classroom-${classroomId}`).emit('tool-updated', { toolType })
    })

    socket.on('student-response', ({ classroomId, studentId, toolType, data }) => {
      socket.to(`classroom-${classroomId}`).emit('response-updated', {
        studentId,
        toolType,
        data,
      })
    })

    socket.on('question-asked', ({ classroomId, studentId }) => {
      socket.to(`classroom-${classroomId}`).emit('question-updated', { studentId })
    })

    socket.on('groups-updated', ({ classroomId }) => {
      socket.to(`classroom-${classroomId}`).emit('groups-changed')
    })

    socket.on('research-link-added', ({ classroomId }) => {
      socket.to(`classroom-${classroomId}`).emit('research-links-updated')
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
<<<<<<< HEAD


=======
>>>>>>> master
