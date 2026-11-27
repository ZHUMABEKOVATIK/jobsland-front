/** Countries where Jobsland runs channels (ISO 3166-1 alpha-2). */
export const COUNTRIES = ["UZ", "KZ", "KG", "TJ", "TM", "AZ", "RU"] as const;
export type CountryCode = (typeof COUNTRIES)[number];

export const DEFAULT_CURRENCY: Record<CountryCode, string> = {
  UZ: "UZS",
  KZ: "KZT",
  KG: "KGS",
  TJ: "TJS",
  TM: "TMT",
  AZ: "AZN",
  RU: "RUB",
};

/** Hand-written names: Intl.DisplayNames lacks data for several of these locales in some WebViews. */
export const COUNTRY_NAMES: Record<string, Record<CountryCode, string>> = {
  eng: { UZ: "Uzbekistan", KZ: "Kazakhstan", KG: "Kyrgyzstan", TJ: "Tajikistan", TM: "Turkmenistan", AZ: "Azerbaijan", RU: "Russia" },
  rus: { UZ: "Узбекистан", KZ: "Казахстан", KG: "Кыргызстан", TJ: "Таджикистан", TM: "Туркменистан", AZ: "Азербайджан", RU: "Россия" },
  uzb: { UZ: "Oʻzbekiston", KZ: "Qozogʻiston", KG: "Qirgʻiziston", TJ: "Tojikiston", TM: "Turkmaniston", AZ: "Ozarbayjon", RU: "Rossiya" },
  kaz: { UZ: "Өзбекстан", KZ: "Қазақстан", KG: "Қырғызстан", TJ: "Тәжікстан", TM: "Түрікменстан", AZ: "Әзірбайжан", RU: "Ресей" },
  kaa: { UZ: "Ózbekstan", KZ: "Qazaqstan", KG: "Qırǵızstan", TJ: "Tájikstan", TM: "Túrkmenstan", AZ: "Ázerbayjan", RU: "Rossiya" },
  kgz: { UZ: "Өзбекстан", KZ: "Казакстан", KG: "Кыргызстан", TJ: "Тажикстан", TM: "Түркмөнстан", AZ: "Азербайжан", RU: "Россия" },
  tjk: { UZ: "Ӯзбекистон", KZ: "Қазоқистон", KG: "Қирғизистон", TJ: "Тоҷикистон", TM: "Туркманистон", AZ: "Озарбойҷон", RU: "Русия" },
  aze: { UZ: "Özbəkistan", KZ: "Qazaxıstan", KG: "Qırğızıstan", TJ: "Tacikistan", TM: "Türkmənistan", AZ: "Azərbaycan", RU: "Rusiya" },
  tkm: { UZ: "Özbegistan", KZ: "Gazagystan", KG: "Gyrgyzystan", TJ: "Täjigistan", TM: "Türkmenistan", AZ: "Azerbaýjan", RU: "Russiýa" },
};
