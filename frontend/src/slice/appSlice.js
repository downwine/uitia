import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'auth',
  initialState: {
    isInit: false,
    isLogin: false,
  },
  reducers: {
    setIsInit: (state, action) => {
      state.isInit = action.payload;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    }
  },
});

export const { setIsInit, setIsLogin } = appSlice.actions;
export default appSlice.reducer;
