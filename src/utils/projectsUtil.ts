import { useSelector } from "react-redux";
import { ProjectInterface } from "../reducers/projectReducer";

const getNewID = (projects:ProjectInterface[]): Number => {
    return projects.length + 1
}

export default {
    getNewID
}