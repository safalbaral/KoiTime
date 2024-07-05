import { configureStore } from "@reduxjs/toolkit";

import timerReducer from "./reducers/timerReducer";
import projectReducer from "./reducers/projectReducer";

const store = configureStore({
    reducer: {
        timer: timerReducer,
        projects: projectReducer
    }
})

export default store