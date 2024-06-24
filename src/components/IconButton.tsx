import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'

interface Props {
  icon: string
  onPress?: (e: GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

const IconButton = ({ icon, onPress, style }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: '#eee4',
          padding: 6,
          borderRadius: 22,
        },
        style,
      ]}
    >
      <Icon
        // @ts-ignore
        name={icon}
        style={{
          color: '#222',
          fontSize: 32,
        }}
      />
    </Pressable>
  )
}

export default IconButton
