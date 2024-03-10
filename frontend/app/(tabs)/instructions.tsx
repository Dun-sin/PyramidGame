import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements';

const index = () => {
  const headerHeight = useHeaderHeight()
  return (
    <SafeAreaView className='bg-darkest flex-1 px-6'>
      <Text className='text-lightest'  style={{marginTop: headerHeight}}>How to Play Pyramid Game</Text>
    </SafeAreaView>
  )
}

export default index