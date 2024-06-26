import { useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Device from 'expo-device'
import * as Application from 'expo-application'

import RootStackParamList from 'types/RootStackParamList'
import useClient from 'hooks/useClient'
import CenterLoading from 'components/CenterLoading'
import Button from 'components/Button'
import TextInput from 'components/TextInput'
import { users } from 'jellyfin-api'
import { AxiosError } from 'axios'
import Text from 'components/Text'

const SelectServer = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'SelectServer'>) => {
  const client = useClient()

  const [server, setServer] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const serverRef = useRef<any>()
  const usernameRef = useRef<any>()
  const passwordRef = useRef<any>()

  useEffect(() => {
    if (client.hasHydrated) {
      if (client.client) {
        navigation.replace('Home')
      } else if (
        !client.client &&
        client.server &&
        client.user &&
        client.token
      ) {
        resetClient()
      } else {
        // BootSplash.hide({ fade: true })
        serverRef.current.focus()
      }
    }
  }, [client.hasHydrated, client.client])

  const resetClient = async () => {
    const clientName = Application.applicationName
    const deviceName = Device.deviceName
    const deviceID = Application.getAndroidId()
    const clientVer = Application.nativeApplicationVersion ?? 'Unknown'
    client.setClient({
      server: client.server,
      clientName: clientName,
      deviceName: deviceName,
      deviceID: deviceID,
      version: clientVer,
      user: client.user,
      token: client.token,
    })
    console.log('CLIENT RESET')
    navigation.replace('Home')
  }

  const submit = async () => {
    setIsLoading(true)
    setError('')
    const clientName = Application.applicationName
    const deviceName = Device.deviceName
    const deviceID = Application.getAndroidId()
    const clientVer = Application.nativeApplicationVersion ?? 'Unknown'
    users
      .authenticateByName(
        server,
        username,
        password,
        clientName,
        deviceName,
        deviceID,
        clientVer
      )
      .then(async (res) => {
        if (Object(res) !== res) {
          setIsLoading(false)
          setError('Unknown error')
          return
        }
        if ('isAxiosError' in res && res.isAxiosError) {
          submitError(res as unknown as AxiosError)
          return
        }

        client.setClient({
          server: server,
          clientName: clientName,
          deviceName: deviceName,
          deviceID: deviceID,
          version: clientVer,
          user: res.User.Id,
          token: res.AccessToken,
        })
        console.log('SIGNED IN')
      }, submitError)
  }
  const submitError = (error: AxiosError) => {
    setIsLoading(false)
    console.log(error.message)
    console.log(error.code)
    if (error.code === 'ERR_BAD_REQUEST')
      setError('Incorrect username and/or password')
    if (error.code === 'ERR_NETWORK')
      setError('Could not connect to the server')
  }

  const styles = StyleSheet.create({
    safe: { flex: 1 },
    view: {
      flex: 1,
      marginHorizontal: 192,
      //marginTop: 0,
      justifyContent: 'center',
      gap: 8,
    },
    input: { fontSize: 16 },
    options: { flexDirection: 'row-reverse', gap: 16 },
  })

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.view}>
        {/* <Text style={{ fontFamily: '700' }}>Select Server</Text> */}
        <TextInput
          ref={serverRef}
          value={server}
          onChangeText={setServer}
          placeholder='https://'
          autoCapitalize='none'
          autoCorrect={false}
          inputMode='url'
          enterKeyHint='next'
          onSubmitEditing={() => {
            usernameRef.current.focus()
          }}
          style={styles.input}
        />
        <TextInput
          ref={usernameRef}
          value={username}
          onChangeText={setUsername}
          placeholder='Username'
          autoCapitalize='none'
          autoCorrect={false}
          inputMode='text'
          enterKeyHint='next'
          onSubmitEditing={() => {
            passwordRef.current.focus()
          }}
          style={styles.input}
        />
        <TextInput
          ref={passwordRef}
          value={password}
          onChangeText={setPassword}
          placeholder='Password'
          autoCapitalize='none'
          autoCorrect={false}
          inputMode='text'
          secureTextEntry={true}
          enterKeyHint='next'
          onSubmitEditing={submit}
          style={styles.input}
        />
        <View style={styles.options}>
          <Button onPress={submit}>Next</Button>
          <View style={{ flex: 1 }}>
            <Text style={{ paddingTop: 8 }} numberOfLines={2}>
              {error}
            </Text>
          </View>
        </View>
        {isLoading && <CenterLoading />}
      </View>
    </SafeAreaView>
  )
}

export default SelectServer
