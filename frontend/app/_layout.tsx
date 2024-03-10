import * as Application from 'expo-application'

import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeWindStyleSheet } from 'nativewind';
import { Stack } from 'expo-router/stack';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

const userId = Application.androidId

const windowWidth = Dimensions.get('window').width
export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) 
  useEffect(() => {
    if (isLoggedIn) return
    
    (async () => {
      console.log('====we start====')
      try {
        const response = await  fetch('http://localhost:9000/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uid: userId })
        })
      
          console.log('===== gotten =======')
          const data = await response.json()
          console.log('=========console=======')
          console.log({data}) 
      } catch (error) {
        console.log(error)
      }
    } )()

  }, [])

  
  return <>
  <Stack  >
      <Stack.Screen
        name='(tabs)'
        options={{
          headerTitle: () => (
            <View className='flex-col justify-center items-center bg-darkest' style={{width: windowWidth}}>
                <View className='flex-row items-center gap-3'>
                  <MaterialCommunityIcons name="pyramid" size={16} color="#CCD6E0" />
                  <Text className='tracking-[23] text-lightest'>PYRAMIDGAME</Text>
                  <MaterialCommunityIcons name="pyramid" size={16} color="#CCD6E0" />
                </View>
              <View className='h-1 bg-brand w-full mt-2'/>
            </View>
          ),
          headerTransparent: true
    }}/>
    </Stack>
  </>
}
