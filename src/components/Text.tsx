import { ReactNode } from 'react'
import { Text as TextRN, StyleProp, TextStyle } from 'react-native'

interface Props {
  children: ReactNode
  numberOfLines?: number
  style?: StyleProp<TextStyle>
}

const Text = ({ children, numberOfLines = 1, style }: Props) => {
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
    >
      {children}
    </TextRN>
  )
}

export default Text
