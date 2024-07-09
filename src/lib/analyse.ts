import { tokenize } from 'react-native-japanese-text-analyzer'
import * as wanakana from 'wanakana'
import Furigana from 'types/Furigana'

const disallowed = ['「', '」', '【', '】']

export const analyse = async (input: string): Promise<Furigana> => {
  const tokens = await tokenize(input)

  const surface = tokens.map((token) => token.surface_form)
  const pronunciation = tokens.map((token, i) => {
    const furi = wanakana.toHiragana(token.pronunciation)
    if (disallowed.includes(furi)) return '*'
    if (surface[i] == 'は' && furi == 'わ') return '*'
    if (surface[i] == 'へ' && furi == 'え') return '*'
    if (surface[i] == furi) return '*'
    if (wanakana.isKana(surface[i]) && wanakana.toHiragana(surface[i]) == furi)
      return '*'
    return furi
  })

  const result = {
    surface: surface,
    pronunciation: pronunciation,
  }

  return result
}
