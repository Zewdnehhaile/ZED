export const ADDIS_LOCATION_SUGGESTIONS = [
  '4 Kilo',
  '6 Kilo',
  'Addis Ababa Stadium',
  'Alem Bank',
  'Arat Kilo',
  'Ayat',
  'Bole',
  'Bole Atlas',
  'Bole Bulbula',
  'Bole Medhanealem',
  'CMC',
  'Gerji',
  'Gofa',
  'Hayahulet',
  'Jemo',
  'Kazanchis',
  'Lebu',
  'Megenagna',
  'Mexico',
  'Piassa',
  'Sar Bet',
  'Summit',
];

const normalizeQuery = (value: string) => value.toLowerCase().replace(/\s+/g, ' ').trim();

export const normalizeLocationInput = (value: string) => value.replace(/\s+/g, ' ').trimStart();

export const getAddisLocationSuggestions = (query: string, limit = 8) => {
  const normalized = normalizeQuery(query);
  if (!normalized) return ADDIS_LOCATION_SUGGESTIONS.slice(0, limit);

  const words = normalized.split(' ').filter(Boolean);

  return ADDIS_LOCATION_SUGGESTIONS
    .filter((location) => {
      const candidate = normalizeQuery(location);
      return words.every((word) => candidate.includes(word));
    })
    .sort((left, right) => {
      const leftValue = normalizeQuery(left);
      const rightValue = normalizeQuery(right);
      const leftStarts = leftValue.startsWith(normalized) ? 0 : 1;
      const rightStarts = rightValue.startsWith(normalized) ? 0 : 1;
      if (leftStarts !== rightStarts) return leftStarts - rightStarts;
      return left.length - right.length;
    })
    .slice(0, limit);
};
