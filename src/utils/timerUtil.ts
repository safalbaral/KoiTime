import { TimerState } from "../reducers/timerReducer";
import { useRef } from "react";
import { incrementTimer } from "../reducers/timerReducer";


const handleTimerStateChange = (timerState: TimerState, intervalRef: React.MutableRefObject<NodeJS.Timeout | null>, dispatch) => {

    if (timerState === TimerState.running){
        intervalRef.current = setInterval(() => dispatch(incrementTimer()), 1000)
    } else if (timerState === TimerState.paused) {
        clearInterval(intervalRef.current as NodeJS.Timeout)
    }
}

const getIntervalRef = () => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    return intervalRef
}

export default {handleTimerStateChange, getIntervalRef}