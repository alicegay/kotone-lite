import { tokenize } from 'react-native-japanese-text-analyzer'
import * as wanakana from 'wanakana'
import Furigana from 'types/Furigana'

export const analyse = async (input: string): Promise<Furigana> => {
  const tokens = await tokenize(input)

  const surface = tokens.map((token) => token.surface_form)
  const pronunciation = tokens.map((token, i) => {
    const furi = wanakana.toHiragana(token.pronunciation)
    if (surface[i] == 'は' && furi == 'わ') return '*'
    if (surface[i] == 'へ' && furi == 'え') return '*'
    if (wanakana.toHiragana(surface[i]) == furi) return '*'
    return furi
  })

  const result = {
    surface: surface,
    pronunciation: pronunciation,
  }

  return result
}
