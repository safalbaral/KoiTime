import { createSlice } from "@reduxjs/toolkit";

export interface ProjectInterface { 
    id: Number,
    name: String,
    timeStarted: Number,
    timeEnded: Number,
}

export interface ProjectPayload {
    currentTime: Number
}

export interface ProjectCreationPayload extends ProjectPayload {
    id: Number,
    name: String,
}

interface ProjectsState {
    projects: ProjectInterface[],
    currentlyTracking: boolean,
    currentlyTrackingID: Number
}

const initialState: ProjectsState = {
    projects: [
        {
        id: 0,
        name: 'Default Project',
        timeStarted: 0,
        timeEnded: 0
    }
],
    currentlyTracking: false
}

const projectSlice = createSlice({
    name:'project',
    initialState,
    reducers: {
        appendProject(state, action): void {
            const payload = action.payload
            state.projects.push(payload)
        },
        startTrackingProject (state, action): void {
            const payload = action.payload
            const project = state.projects.find(project => project.id === payload.id)
            project.timeStarted = payload.currentTime
            console.log('CHANGED start time', project)
            state.currentlyTracking = true
            state.currentlyTrackingID = payload.id
        },
        stopTrackingProject (state, action): void {
            const payload = action.payload
            const project = state.projects.find(project => project.id === state.currentlyTrackingID)
            project.timeEnded = payload.currentTime
            console.log('CHANGED end time', project)
            state.currentlyTracking = false
            state.currentlyTrackingID = 0
        }
    }
})

export const createProject = (payload:ProjectPayload) => {
    const newProject: ProjectInterface = {
        id: payload.id,
        name: payload.name as string,
        timeStarted: payload.currentTime,
        timeEnded: 0
    }
    return(appendProject(newProject))
}

export const {startTrackingProject, stopTrackingProject, appendProject} = projectSlice.actions

export default projectSlice.reducer 