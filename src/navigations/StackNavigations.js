import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../Screens/Home';
import TextGeneration from '../Screens/TextGeneration';
import AudioGeneration from '../Screens/AudioGeneration';
import ImageFeed from '../Screens/ImageFeed';
import ChatScreen from '../Screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigations() {
  return (
    <Stack.Navigator initialRouteName='home' screenOptions={{headerShown:false}}>
        <Stack.Screen name="home" component={Home}/>
        <Stack.Screen name="text" component={TextGeneration}/>
        <Stack.Screen name="audio" component={AudioGeneration}/>
        <Stack.Screen name="imagefeed" component={ImageFeed}/>
        <Stack.Screen name="chat" component={ChatScreen}/>
        
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})