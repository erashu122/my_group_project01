import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState : {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    setUserId: (state, action) => {
      state.userId = action.payload;
      localStorage.setItem('userId', action.payload);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;

      localStorage.clear();
    },
  },
});

export const { setCredentials, setUserId, logout } = authSlice.actions;
export default authSlice.reducer;