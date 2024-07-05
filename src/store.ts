import { configureStore } from "@reduxjs/toolkit";

import timerReducer from "./reducers/timerReducer";

const store = configureStore({
    reducer: {
        timer: timerReducer
    }
})

export default store