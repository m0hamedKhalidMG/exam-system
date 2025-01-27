import { createSlice } from '@reduxjs/toolkit';

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    profiles: [], // Store all student profiles
    profile: null, // Currently logged-in student profile
    exams: [], // List of exams taken by the student
    results: [], // Results of completed exams
    leaderboard: [], // Leaderboard data
  },
  reducers: {
    loginStudent: (state, action) => {
      state.profile = action.payload; // Set student profile on login
    },
    logoutStudent: (state) => {
      state.profile = null;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    addProfile: (state, action) => {
      state.profiles.push(action.payload);
    },
    updateProfile: (state, action) => {
      const { id, updatedData } = action.payload;
      const profileIndex = state.profiles.findIndex(
        (profile) => profile.id === id
      );
      if (profileIndex !== -1) {
        state.profiles[profileIndex] = {
          ...state.profiles[profileIndex],
          ...updatedData,
        };
        // Update the logged-in profile if it's the same user
        if (state.profile?.id === id) {
          state.profile = { ...state.profile, ...updatedData };
        }
      }
    },
    addExamResult: (state, action) => {
      state.results.push(action.payload);
    },
    setLeaderboard: (state, action) => {
      state.leaderboard = action.payload;
    },
    addExamToHistory: (state, action) => {
      const { level, answers, questions } = action.payload;
      state.exams.push({
        level,
        answers,
        questions, // Store the questions to verify answers later
        date: new Date().toISOString(),
      });
    },
  },
});

export const {
  setProfile,
  addProfile,
  updateProfile,
  addExamResult,
  setLeaderboard,
  addExamToHistory,
} = studentSlice.actions;
export const { loginStudent, logoutStudent } = studentSlice.actions;

export default studentSlice.reducer;
