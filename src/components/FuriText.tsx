import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Furigana from 'types/Furigana'
import Text from './Text'
import textSize from 'react-native-text-size'

interface Props {
  furigana: Furigana
  surfaceSize: number
  pronunciationSize: number
  surfaceFont: string
  pronunciationFont: string
}

const FuriText = ({
  furigana,
  surfaceSize,
  pronunciationSize,
  surfaceFont,
  pronunciationFont,
}: Props) => {
  const disallowed = ['*', '「', '」']

  const styles = StyleSheet.create({
    surface: {
      fontSize: surfaceSize,
      fontFamily: surfaceFont,
    },
    pronunciation: {
      fontSize: pronunciationSize,
      fontFamily: pronunciationFont,
      position: 'absolute',
      top: -pronunciationSize,
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
    measure().then(() => {
      setReady(true)
      setWidths(_widths)
      setTotals(_totals)
      setFWidths(_fwidths)
    })
  }, [furigana])

  const measure = async () => {
    setWidths([])
    setTotals([])
    setFWidths([])
    setReady(false)
    for (let i = 0; i < furigana.surface.length; i++) {
      const size = await textSize.measure({
        text: furigana.surface[i],
        fontFamily: surfaceFont,
        fontSize: surfaceSize,
        usePreciseWidth: true,
      })
      _widths = [..._widths, size.width]
      _totals = [..._totals, _totals[_totals.length - 1] + size.width]
    }
    for (let i = 0; i < furigana.pronunciation.length; i++) {
      const size = await textSize.measure({
        text: furigana.pronunciation[i],
        fontFamily: pronunciationFont,
        fontSize: pronunciationSize,
        usePreciseWidth: true,
      })
      _fwidths = [..._fwidths, size.width]
    }
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
        furigana.pronunciation.map((token, i) =>
          token != furigana.surface[i] &&
          !disallowed.includes(token) &&
          totals.length > i &&
          widths.length > i &&
          fwidths.length > i ? (
            <Text
              key={i + 'f'}
              style={[
                styles.pronunciation,
                { left: totals[i] + widths[i] / 2 - fwidths[i] / 2 },
              ]}
            >
              {furigana.pronunciation[i]}
            </Text>
          ) : null
        )}
    </View>
  )
}

export default FuriText
