import { ActivityIndicator, View } from 'react-native'

const CenterLoading = () => {
  return (
    <View
      style={{
        position: 'absolute',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <ActivityIndicator color={'#ffffff'} size={64} />
    </View>
  )
}

export default CenterLoading
