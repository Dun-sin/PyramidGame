import { Text, View } from 'react-native';

import { Link } from 'expo-router';
import LottieView from 'lottie-react-native'
import PyramidAnimation from '../../assets/pyramid.json'

const Welcome = () => (
  <View className="flex-1 items-center justify-center bg-darkest">
    <LottieView
      autoPlay
      style={{
        width: 200,
        height: 200
      }}
      source={PyramidAnimation}
    />
    <View>
      <Text className='text-lightest font-semibold text-2xl'>Welcome to the Pyramid Game</Text>
    <Text className='text-lightest'>Inspired by the Kdrama Pyramid Game, go watch it!!!</Text>
    </View>

    <View>
      <Text>Ready to play?</Text>
      <Link href='/instructions' className='text-light underline'>Start By Reading the Instructions</Link>
    </View>
  </View>
);

export { Welcome };
