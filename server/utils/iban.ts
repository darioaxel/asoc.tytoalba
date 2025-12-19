// utils/iban.ts
const IBAN_ES_REGEX = /^ES\d{2}\s?\d{4}\s?\d{4}\s?\d{2}\s?\d{10}$/i

export function isValidSpanishIBAN(iban?: string): boolean {
  if (!iban) return false
  const clean = iban.replace(/\s/g, '').toUpperCase()
  if (!IBAN_ES_REGEX.test(clean)) return false

  // Reubicar y convertir letras
  const rearr = clean.slice(4) + clean.slice(0, 4)
  let numeric = ''
  for (const ch of rearr) {
    numeric += (ch >= 'A' && ch <= 'Z')
      ? String(ch.charCodeAt(0) - 55)
      : ch
  }

  // Módulo 97 sin BigInt
  let mod = 0
  for (let i = 0; i < numeric.length; i++) {
    mod = (mod * 10 + Number(numeric[i])) % 97
  }
  return mod === 1
}