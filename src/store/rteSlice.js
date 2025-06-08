import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  wordCount: 0,
};

const rteSlice = createSlice({
  name: "rte",
  initialState,
  reducers: {
    setWordCount: (state, action) => {
      console.log("🔥setWordCount Action Payload: ", action.payload);
      state.wordCount = action.payload;
    },
    resetWordCount: (state) => {
      state.wordCount = 0;
    },
  },
});
export const {setWordCount, resetWordCount} = rteSlice.actions;
export default rteSlice.reducer;
