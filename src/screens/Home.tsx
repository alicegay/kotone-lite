import { useEffect, useState } from 'react'
import { DimensionValue, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { StatusBar } from 'expo-status-bar'
import { useKeepAwake } from 'expo-keep-awake'
import { useQueryClient } from '@tanstack/react-query'
import { getBlurHashAverageColor } from 'fast-blurhash'
import tinycolor from 'tinycolor2'
import Item from 'jellyfin-api/lib/types/media/Item'

import useClient from 'hooks/useClient'
import useInterval from 'hooks/useInterval'
import useSessions from 'api/useSessions'
import ticksToTime from 'lib/ticksToTime'
import Text from 'components/Text'
import IconButton from 'components/IconButton'
import { sessions } from 'jellyfin-api'

const Home = () => {
  useKeepAwake()

  const client = useClient()
  const query = useQueryClient()
  const session = useSessions()
  const { height } = useWindowDimensions()

  const [track, setTrack] = useState<Item>()
  const [image, setImage] = useState<string>()
  const [color, setColor] = useState<string>('#222')

  useEffect(() => {
    if (!!session.data && !!session.data.NowPlayingItem) {
      setTrack(session.data.NowPlayingItem)
    }
  }, [session.data])

  useEffect(() => {
    if (!!track) {
      setImage(client.server + '/Items/' + track.Id + '/Images/Primary')
      if ('Primary' in track.ImageTags || track.AlbumPrimaryImageTag) {
        const average = getBlurHashAverageColor(
          track.ImageBlurHashes.Primary[
            'Primary' in track.ImageTags
              ? track.ImageTags.Primary
              : track.AlbumPrimaryImageTag
          ]
        )
        const tcolor = tinycolor({
          r: average[0],
          g: average[1],
          b: average[2],
        })
        if (tcolor.isLight()) {
          setColor(tcolor.darken(30).toHex8String())
        } else {
          setColor(tcolor.toHex8String())
        }
      } else {
        setColor('#222')
      }
    }
  }, [track])

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

  useInterval(() => {
    query.invalidateQueries({ queryKey: ['sessions'] })
  }, 3_000)

  return (
    <>
      <StatusBar style='light' />
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: 64,
          backgroundColor: color,
        }}
      >
        {!!track && (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              gap: 16,
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                gap: 32,
              }}
            >
              <Image
                source={image}
                contentFit='cover'
                onError={() => {
                  setImage(
                    client.server +
                      '/Items/' +
                      track.AlbumId +
                      '/Images/Primary'
                  )
                }}
                style={{
                  height: (height / 4) * 2.4,
                  width: (height / 4) * 2.4,
                  borderRadius: 24,
                  overflow: 'hidden',
                }}
              />
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <Text
                  style={{ fontFamily: '700', fontSize: 48 }}
                  numberOfLines={2}
                >
                  {track.Name}
                </Text>
                {!!track.Artists && (
                  <Text style={{ fontFamily: '500', fontSize: 24 }}>
                    {track.Artists.join(', ')}
                  </Text>
                )}
                {!!track.Album && track.Name != track.Album && (
                  <Text style={{ fontFamily: '400', fontSize: 20 }}>
                    {track.Album}
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 16,
                alignItems: 'center',
              }}
            >
              <Text>{ticksToTime(session.data.PlayState.PositionTicks)}</Text>
              <View
                style={{
                  backgroundColor: '#eee4',
                  height: 4,
                  flexGrow: 1,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    backgroundColor: '#eee',
                    height: 4,
                    width: ((session.data.PlayState.PositionTicks /
                      track.RunTimeTicks) *
                      100 +
                      '%') as DimensionValue,
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                />
              </View>
              <Text>{ticksToTime(track.RunTimeTicks)}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 32,
              }}
            >
              <IconButton
                icon='skip-previous'
                onPress={() => {
                  sessions.playState(
                    client.api,
                    session.data.Id,
                    'PreviousTrack'
                  )
                }}
              />
              <IconButton
                icon={session.data.PlayState.IsPaused ? 'play' : 'pause'}
                onPress={() => {
                  sessions.playState(client.api, session.data.Id, 'PlayPause')
                }}
              />
              <IconButton
                icon='skip-next'
                onPress={() => {
                  sessions.playState(client.api, session.data.Id, 'NextTrack')
                }}
              />
              {/* <IconButton icon='heart' /> */}
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  )
}

export default Home
