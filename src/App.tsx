import { useCallback } from 'react'
import { registerRootComponent } from 'expo'
import { NavigationContainer } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import RootStackParamList from 'types/RootStackParamList'
import Home from 'screens/Home'
import SelectServer from 'screens/SelectServer'

const Stack = createNativeStackNavigator<RootStackParamList>()
const queryClient = new QueryClient()

const App = () => {
  const [fontsLoaded, fontError] = useFonts({
    '400': require('assets/fonts/NunitoRoundedMplus-Regular.ttf'),
    '500': require('assets/fonts/NunitoRoundedMplus-Medium.ttf'),
    '700': require('assets/fonts/NunitoRoundedMplus-Bold.ttf'),
  })

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded || fontError) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded, fontError]);

  const navTheme = {
    dark: true,
    colors: {
      primary: '#ff0000',
      background: '#000',
      card: '#000',
      text: '#eee',
      border: '#000',
      notification: '#000',
    },
  }

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          initialRouteName='SelectServer'
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='SelectServer' component={SelectServer} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}

export default registerRootComponent(App)
