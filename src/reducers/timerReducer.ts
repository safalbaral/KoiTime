import { createSlice } from "@reduxjs/toolkit";

export enum TimerStates {
  started = "started",
  stopped = "stopped",
}

interface TimerState {
  timerState: TimerStates;
  elapsedTime: number;
}

const initialState: TimerState = {
  timerState: TimerStates.stopped,
  elapsedTime: 0,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    incrementTimer: (state) => {
      state.elapsedTime += 1;
    },
    resetTimer: (state) => {
      state.elapsedTime = 0;
    },
    startState: (state) => {
      state.timerState = TimerStates.started;
    },
    stopState: (state) => {
      state.timerState = TimerStates.stopped;
    },
  },
});

export const { incrementTimer, resetTimer, startState, stopState } =
  timerSlice.actions;

export default timerSlice.reducer;
