import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

<<<<<<< HEAD
app.use(cors());
=======
app.use(cors({
  origin: "*"
}));
>>>>>>> master
app.use(express.json());

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-classroom', ({ classroomId, role, studentId }) => {
    socket.join(`classroom-${classroomId}`);
    if (role === 'student' && studentId) {
      socket.join(`student-${studentId}`);
    }
  });

  socket.on('student-joined', ({ classroomId }) => {
    socket.to(`classroom-${classroomId}`).emit('student-list-updated');
  });

  socket.on('tool-toggled', ({ classroomId, toolType }) => {
    socket.to(`classroom-${classroomId}`).emit('tool-updated', { toolType });
  });

  socket.on('student-response', ({ classroomId, studentId, toolType, data }) => {
    socket.to(`classroom-${classroomId}`).emit('response-updated', {
      studentId,
      toolType,
      data,
    });
  });

  socket.on('question-asked', ({ classroomId, studentId }) => {
    socket.to(`classroom-${classroomId}`).emit('question-updated', { studentId });
  });

  socket.on('groups-updated', ({ classroomId }) => {
    socket.to(`classroom-${classroomId}`).emit('groups-changed');
  });

  socket.on('research-link-added', ({ classroomId }) => {
    socket.to(`classroom-${classroomId}`).emit('research-links-updated');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('Server running on port', PORT);
});