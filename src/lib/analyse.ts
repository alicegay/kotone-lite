import { tokenize } from 'react-native-japanese-text-analyzer'
import * as wanakana from 'wanakana'
import Furigana from 'types/Furigana'

export const analyse = async (input: string): Promise<Furigana> => {
  const tokens = await tokenize(input)

  const surface = tokens.map((token) => token.surface_form)
  const pronunciation = tokens.map((token, i) => {
    const result = wanakana.toHiragana(token.pronunciation)
    if (surface[i] == 'は' && result == 'わ') return '*'
    if (wanakana.toHiragana(surface[i]) == result) return '*'
    return result
  })

  const result = {
    surface: surface,
    pronunciation: pronunciation,
  }

  return result
}
