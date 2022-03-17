import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    is_active: "",
    type: "",
  },
  access: "",
  refresh: "",
};

export const userSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("state user", action.payload.user);
      state.user = action.payload.user;
    },
    setToken: (state, action) => {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
    },
    logout(state) {
      state.user = null;
      state.refresh = null;
      state.access = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setToken, logout } = userSlice.actions;

// selectors one selector for each item
// export const getUser = (state) => state.user.user;
// export const getToken = (state) => state.user.token;

export default userSlice.reducer;
