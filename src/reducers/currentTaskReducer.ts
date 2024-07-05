import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CurrentTaskDetails {
    id: number, //TODO: Confirm that sqlite returns number for ids
    name: string,
    t_id: number //TODO: Confirm that sqlite returns number for ids
}

interface CurrentTask {
    task : CurrentTaskDetails | null,
    isTracking: boolean
}

const initialState: CurrentTask = {
    task: null,
    isTracking: false
}

const currentTaskSlice = createSlice({
    name:"currentTask",
    initialState,
    reducers: {
        addCurrentTask: (state, action: PayloadAction<CurrentTaskDetails>) => {
            state.task = action.payload
            state.isTracking = true
        },
        removeCurrentTask: state => {
            state.task = null
            state.isTracking = false
        }
    }
})

export const {addCurrentTask, removeCurrentTask} = currentTaskSlice.actions

export default currentTaskSlice.reducer