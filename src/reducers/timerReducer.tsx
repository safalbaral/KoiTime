import { createSlice } from "@reduxjs/toolkit";

export enum TimerState {
    running = 'RUNNING',
    paused = 'PAUSED',
    stopped = 'STOPPED'
}

export interface TimerInterface {
    state: TimerState,
    elapsedTime: number
}

const initialState: TimerInterface = {
    state: TimerState.stopped,
    elapsedTime: 0
}

const timerSlice = createSlice({
    name:'timer',
    initialState,
    reducers : {
        resetTimer(state): void {
            state.state = TimerState.stopped
            state.elapsedTime = 0 
        },
        pauseTimer(state): void {
            state.state = TimerState.paused            
        },
        startTimer(state): void {
            state.state = TimerState.running
        },
        incrementTimer(state): void {
            state.elapsedTime += 1
        }
    }
})

export const { resetTimer, pauseTimer, startTimer, incrementTimer } = timerSlice.actions

export default timerSlice.reducer