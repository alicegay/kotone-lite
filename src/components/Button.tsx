import { ReactNode, forwardRef, useState } from 'react'
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'

interface Props {
  children?: ReactNode
  type?: 'primary'
  icon?: string
  onPress?: (e: GestureResponderEvent) => void
  onLongPress?: (e: GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
}

const Button = forwardRef<View, Props>(
  (
    { children, type = 'primary', icon, onPress, onLongPress, style }: Props,
    ref
  ) => {
    const [focus, setFocus] = useState(false)

    const styles = StyleSheet.create({
      root: {
        minWidth: 36,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        minHeight: 36,
        backgroundColor: '#222',
      },
      rootFocus: {
        backgroundColor: '#fff',
      },
      rootWithLabel: {
        minWidth: 96,
      },
      icon: {
        fontSize: 14,
        color: '#fff',
      },
      iconFocus: {
        color: '#222',
      },
      iconWithLabel: {
        marginLeft: 16,
        marginRight: -16,
      },
      label: {
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 8,
        marginHorizontal: 24,
        color: '#fff',
        fontFamily: '700',
      },
      labelFocus: {
        color: '#222',
      },
    })

    return (
      <Pressable
        ref={ref}
        onFocus={() => {
          setFocus(true)
        }}
        onBlur={() => {
          setFocus(false)
        }}
        onPress={onPress}
        onLongPress={onLongPress}
        style={[
          styles.root,
          focus && styles.rootFocus,
          children && styles.rootWithLabel,
          style,
        ]}
      >
        {icon && (
          <Icon
            // @ts-ignore
            style={[
              styles.icon,
              focus && styles.iconFocus,
              children && styles.iconWithLabel,
            ]}
          />
        )}
        {children && (
          <Text
            numberOfLines={1}
            style={[styles.label, focus && styles.labelFocus]}
          >
            {children}
          </Text>
        )}
      </Pressable>
    )
  }
)

export default Button
