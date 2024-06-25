import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Furigana from 'types/Furigana'
import Text from './Text'
import textSize from 'react-native-text-size'

interface Props {
  furigana: Furigana
}

const FuriText = ({ furigana }: Props) => {
  const disallowed = ['*', '「', '」']

  const styles = StyleSheet.create({
    surface: {
      fontSize: 40,
      fontFamily: '700',
    },
    pronunciation: {
      fontSize: 16,
      fontFamily: '500',
      position: 'absolute',
      top: -16,
    },
  })

  const [ready, setReady] = useState<boolean>(false)
  let _widths = []
  let _totals = [0]
  let _fwidths = []

  const [widths, setWidths] = useState<number[]>([])
  const [totals, setTotals] = useState<number[]>([])
  const [fwidths, setFWidths] = useState<number[]>([])

  useEffect(() => {
    measure()
  }, [furigana])

  const measure = async () => {
    setWidths([])
    setTotals([])
    setReady(false)
    for (let i = 0; i < furigana.surface.length; i++) {
      const size = await textSize.measure({
        text: furigana.surface[i],
        fontFamily: '700',
        fontSize: 40,
        usePreciseWidth: true,
      })
      _widths = [..._widths, size.width]
      _totals = [..._totals, _totals[_totals.length - 1] + size.width]
    }
    for (let i = 0; i < furigana.pronunciation.length; i++) {
      const size = await textSize.measure({
        text: furigana.pronunciation[i],
        fontFamily: '500',
        fontSize: 16,
        usePreciseWidth: true,
      })
      _fwidths = [..._fwidths, size.width]
    }
    setReady(true)
    setWidths(_widths)
    setTotals(_totals)
    setFWidths(_fwidths)
  }

  return (
    <View style={{ flexDirection: 'row' }}>
      {/* <Text style={styles.surface}>{furigana.surface.join('')}</Text> */}
      {furigana.surface.map((token, i) => (
        <Text key={i} style={styles.surface}>
          {token}
        </Text>
      ))}
      {!!ready &&
        !!widths &&
        !!totals &&
        furigana.pronunciation.map(
          (token, i) =>
            token != furigana.surface[i] &&
            !disallowed.includes(token) && (
              <Text
                key={i + 'f'}
                style={[
                  styles.pronunciation,
                  { left: totals[i] + widths[i] / 2 - fwidths[i] / 2 },
                ]}
              >
                {furigana.pronunciation[i]}
              </Text>
            )
        )}
    </View>
  )
}

export default FuriText
