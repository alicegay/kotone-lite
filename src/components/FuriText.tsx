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
  numberOfLines?: number
}

const FuriText = ({
  furigana,
  surfaceSize,
  pronunciationSize,
  surfaceFont,
  pronunciationFont,
  numberOfLines = 1,
}: Props) => {
  const styles = StyleSheet.create({
    surface: {
      fontSize: surfaceSize,
      fontFamily: surfaceFont,
      //paddingVertical: pronunciationSize / 4,
    },
    pronunciation: {
      fontSize: pronunciationSize,
      fontFamily: pronunciationFont,
      position: 'absolute',
    },
  })

  const [ready, setReady] = useState<boolean>(false)
  const [limit, setLimit] = useState<number>(null)

  let _splits = [0]
  let _widths = []
  let _totals = [0]
  let _fwidths = []

  const [splits, setSplits] = useState<number[]>([])
  const [widths, setWidths] = useState<number[]>([])
  const [totals, setTotals] = useState<number[]>([])
  const [fwidths, setFWidths] = useState<number[]>([])
  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    if (!!limit) {
      measure().then(() => {
        setReady(true)
        setSplits(_splits)
        setWidths(_widths)
        setTotals(_totals)
        setFWidths(_fwidths)
      })
    }
  }, [furigana, limit])

  const measure = async () => {
    setReady(false)
    setSplits([])
    setWidths([])
    setTotals([])
    setFWidths([])
    setHeight(0)
    _splits = [0]
    _widths = []
    _totals = [0]
    _fwidths = []
    for (let i = 0; i < furigana.surface.length; i++) {
      const size = await textSize.measure({
        text: furigana.surface[i],
        fontFamily: surfaceFont,
        fontSize: surfaceSize,
        usePreciseWidth: true,
      })
      if (height != size.height) setHeight(size.height)
      _widths = [..._widths, size.width]
      if (_totals[_totals.length - 1] + size.width > limit) {
        _splits = [..._splits, i]
        _totals = [..._totals.slice(0, -1), 0, size.width]
      } else {
        _totals = [..._totals, _totals[_totals.length - 1] + size.width]
      }
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
    <View
      style={{ flexDirection: 'column' }}
      onLayout={(e) => {
        setLimit(e.nativeEvent.layout.width)
      }}
    >
      {!!ready &&
        !!limit &&
        !!splits &&
        !!widths &&
        !!totals &&
        splits.map((split, y) => {
          if (y >= numberOfLines) return null
          const pronun =
            splits.length > 1
              ? y == splits.length - 1
                ? furigana.pronunciation.slice(split)
                : furigana.pronunciation.slice(split, splits[y + 1])
              : furigana.pronunciation
          return (
            <View key={y + 's'}>
              <Text style={styles.surface}>
                {splits.length > 1
                  ? y == splits.length - 1
                    ? furigana.surface.slice(split).join('')
                    : furigana.surface.slice(split, splits[y + 1]).join('')
                  : furigana.surface.join('')}
              </Text>
              {pronun.map((token, i) => {
                const ii = i + split
                return token != '*' &&
                  totals.length > ii &&
                  widths.length > ii &&
                  fwidths.length > ii ? (
                  <Text
                    key={ii + 'f'}
                    style={[
                      styles.pronunciation,
                      {
                        left: totals[ii] + widths[ii] / 2 - fwidths[ii] / 2,
                        top: (-pronunciationSize / 3) * 2,
                      },
                    ]}
                  >
                    {furigana.pronunciation[ii]}
                  </Text>
                ) : null
              })}
            </View>
          )
        })}
    </View>
  )
}

export default FuriText
