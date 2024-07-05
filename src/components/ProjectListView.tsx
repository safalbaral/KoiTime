import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useSelector } from "react-redux"

import projectsUtil from "../utils/projectsUtil"
import { ProjectInterface } from "../reducers/projectReducer"


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
// TODO: Implement projects as a prop here
const ProjectListView = () => {
    const projects = useSelector(state => state.projects.projects)
    console.log('PROJJJJ', projects)
    return (
        <View>
            {projects.map(project => {
                return(<Text key={project.id.toString()} >Name {project.name} Started {project.timeStarted.toString()} Ended {project.timeEnded.toString()}</Text>)
            })}
        </View>
    )
}

export default ProjectListView