import { ReactNode } from 'react'
import {
  Text as TextRN,
  StyleProp,
  TextStyle,
  LayoutChangeEvent,
} from 'react-native'

interface Props {
  children: ReactNode
  numberOfLines?: number
  style?: StyleProp<TextStyle>
  onLayout?: (event: LayoutChangeEvent) => void
}

const Text = ({ children, numberOfLines = 1, style, onLayout }: Props) => {
  return (
    <TextRN
      numberOfLines={numberOfLines}
      style={[
        {
          color: '#eee',
          fontSize: 14,
          fontFamily: '400',
        },
        style,
      ]}
      onLayout={onLayout}
    >
      {children}
    </TextRN>
  )
}

export default Text
