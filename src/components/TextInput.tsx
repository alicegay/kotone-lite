import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import {
  StyleSheet,
  TextInput as TextInputOrig,
  TextInputProps,
  Pressable,
} from 'react-native'

interface TypeInputHandle extends TextInputOrig {
  focus: () => void | null
  blur: () => void | null
}

const TextInput = forwardRef<Partial<TypeInputHandle>, TextInputProps>(
  ({ style, ...props }: TextInputProps, ref) => {
    useImperativeHandle(ref, () => ({
      focus: () => {
        textRef.current.focus()
      },
      blur: () => {
        textRef.current.blur()
      },
    }))

    const [focus, setFocus] = useState(false)
    const textRef = useRef<TextInputOrig>()

    const styles = StyleSheet.create({
      input: {
        backgroundColor: '#222',
        color: '#fff',
        fontFamily: '500',
        borderRadius: 32,
        overflow: 'hidden',
        paddingHorizontal: 16,
        paddingVertical: 4,
      },
      focus: {
        backgroundColor: '#fff',
        color: '#222',
      },
    })

    return (
      <Pressable
        // @ts-ignore
        ref={ref}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onPress={() => textRef.current.focus()}
      >
        <TextInputOrig
          ref={textRef}
          placeholderTextColor='#888'
          {...props}
          style={[styles.input, focus && styles.focus, style]}
        />
      </Pressable>
    )
  }
)

export default TextInput
