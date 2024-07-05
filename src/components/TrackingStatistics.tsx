import React from "react"
import { StyleSheet, View, Text } from "react-native"

const styles = StyleSheet.create(
    {
        statsContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around'
        }
    }
)

const TrackingStatistics = () => {
    return(
        <View style={styles.statsContainer}>
            <View>
                <Text>Text</Text>
            </View>
            <View>
                <Text>Text</Text>
            </View>
            <View>
                <Text>Text</Text>
            </View>
        </View>
    )
}

export default TrackingStatistics