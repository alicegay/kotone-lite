import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import useClient from 'hooks/useClient'
import useSessions from 'api/useSessions'
import Text from 'components/Text'
import useInterval from 'hooks/useInterval'

const Home = () => {
  const client = useClient()
  const { data, isLoading } = useSessions()

  // const socket = new WebSocket(
  //   client.server.replace('https://', 'wss://').replace('http://', 'wss://') +
  //     '/socket?api_key=' +
  //     client.token +
  //     '&deviceId=' +
  //     client.deviceID
  // )

  // socket.onopen = () => {
  //   send({ MessageType: 'KeepAlive' })
  //   send({ MessageType: 'SessionsStart', Data: '0,1500' })
  // }
  // socket.onmessage = (e) => {
  //   //console.log('MESSAGE', e.data)
  // }
  // socket.onerror = (e) => {
  //   console.log('ERROR', e.message)
  // }
  // socket.onclose = (e) => {
  //   console.log('CONNECTION CLOSED', e.code, e.reason)
  // }

  // const send = (message: { MessageType: string; Data?: string | Object }) => {
  //   socket.send(JSON.stringify(message))
  // }

  // useInterval(() => {
  //   send({ MessageType: 'KeepAlive' })
  // }, 30_000)

  return (
    <SafeAreaView>
      {!isLoading && !!data && (
        <View>
          <Text>{data.NowPlayingItem.Name}</Text>
          <Text>{data.NowPlayingItem.Artists.join(', ')}</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

export default Home
