import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import StackNavigations from './src/navigations/StackNavigations'

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigations/>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({})