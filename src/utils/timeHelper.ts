const getCurrentTime = (): Number => {
    const date = new Date()
    return date.getTime()
}

export default {
    getCurrentTime
}