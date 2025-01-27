// import { createSlice } from '@reduxjs/toolkit';

// const adminSlice = createSlice({
//   name: 'admin',
//   initialState: {
//     questions: [], // List of questions added by the admin
//     exams: [], // List of scheduled exams
//     students: [], // List of registered students
//   },
//   reducers: {
//     // Add a new question to the questions list
//     addQuestion: (state, action) => {
//       state.questions.push(action.payload);
//     },

//     // Delete a specific question by ID
//     deleteQuestion: (state, action) => {
//       state.questions = state.questions.filter(
//         (question) => question.id !== action.payload
//       );
//     },

//     // Add a new exam to the exams list
//     addExam: (state, action) => {
//       state.exams.push(action.payload);
//     },

//     // Delete a specific exam by ID
//     deleteExam: (state, action) => {
//       state.exams = state.exams.filter((exam) => exam.id !== action.payload);
//     },

//     // Update a specific exam by ID with new data
//     updateExam: (state, action) => {
//       const { id, updatedExam } = action.payload;
//       const index = state.exams.findIndex((exam) => exam.id === id);
//       if (index !== -1) {
//         state.exams[index] = { ...state.exams[index], ...updatedExam };
//       }
//     },

//     // Register a new student
//     registerStudent: (state, action) => {
//       state.students.push({ ...action.payload, blocked: false });
//     },

//     // Block a specific student by ID
//     blockStudent: (state, action) => {
//       state.students = state.students.map((student) =>
//         student.id === action.payload ? { ...student, blocked: true } : student
//       );
//     },

//     // Unblock a specific student by ID
//     unblockStudent: (state, action) => {
//       state.students = state.students.map((student) =>
//         student.id === action.payload ? { ...student, blocked: false } : student
//       );
//     },
//   },
// });

// export const {
//   addQuestion,
//   deleteQuestion,
//   addExam,
//   deleteExam,
//   updateExam,
//   registerStudent,
//   blockStudent,
//   unblockStudent,
// } = adminSlice.actions;

// export default adminSlice.reducer;
// without data

// with data
import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    questions: [
    
    ],
    exams: [
     
    ],
    students: [
    ],
  },
  reducers: {
    loginAdmin: (state) => {
      state.isLoggedIn = true;
    },
    logoutAdmin: (state) => {
      state.isLoggedIn = false;
    },
    // Add a new question to the questions list
    addQuestion: (state, action) => {
      state.questions.push(action.payload);
    },

    // Delete a specific question by ID
    deleteQuestion: (state, action) => {
      state.questions = state.questions.filter(
        (question) => question.id !== action.payload
      );
    },

    // Add a new exam to the exams list
    addExam: (state, action) => {
      state.exams.push(action.payload);
    },
    loadExam: (state, action) => {
      state.exams = action.payload;
    },

    // Delete a specific exam by ID
    deleteExam: (state, action) => {
      state.exams = state.exams.filter((exam) => exam._id !== action.payload);
    },

    // Update a specific exam by ID with new data
    updateExam: (state, action) => {
      const { id, updatedExam } = action.payload;
      const index = state.exams.findIndex((exam) => exam._id === id);
      if (index !== -1) {
        state.exams[index] = { ...state.exams[index], ...updatedExam };
      }
    },

    // Register a new student
    registerStudent: (state, action) => {
      state.students.push({ ...action.payload, blocked: false });
    },

    // Block a specific student by ID
    blockStudent: (state, action) => {
      state.students = state.students.map((student) =>
        student._id === action.payload ? { ...student, suspended: true } : student
      );
    },
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    // Unblock a specific student by ID
    unblockStudent: (state, action) => {
      state.students = state.students.map((student) =>
        student._id === action.payload ? { ...student, suspended: false } : student
      );
    },
  },
});

export const {
  addQuestion,
  deleteQuestion,
  addExam,
  loadExam,
  deleteExam,
  updateExam,
  registerStudent,
  blockStudent,
  unblockStudent,
} = adminSlice.actions;
export const { loginAdmin, logoutAdmin } = adminSlice.actions;

export default adminSlice.reducer;
