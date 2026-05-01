const cityMaps = {
  vinnytsia: './VinitsaMap.png',
  lutsk: './LutskMap.png',
  luhansk: './LuganskMap.png',
  dnipro: './DneprMap.png',
  donetsk: './DonetskMap.png',
  zhytomyr: './ZutomyrMap.png',
  uzhhorod: './UzgorodMap.png',
  zaporizhzhia: './Zaporozya.png',
  'ivano-frankivsk': './IvanoFrankovsk.png',
  kyiv: './KiyvMap.png',
  kropyvnytskyi: './Kropivnitskyi.png',
  crimea: './KrymMap.png',
  lviv: './Lviv.png',
  mykolaiv: './Nikolaev.png',
  odesa: './Odessa.png',
  poltava: './Poltava.png',
  rivne: './Rovno.png',
  sumy: './Sumy.png',
  ternopil: './Ternopil.png',
  kharkiv: './Kharkiv.png',
  kherson: './Kherson.png',
  khmelnytskyi: './Khmelnitskiy.png',
  cherkasy: './CherkasyMap.png',
  chernihiv: './ChernigovMap.png',
  chernivtsi: './ChernivtsiMap.png'
};

const commonJobs = [
  {
    id: 'warehouse',
    title: 'Склад',
    short: 'СКЛ',
    x: 32,
    y: 46,
    pay: 240,
    energy: 12,
    xp: 4,
    skill: 'strength',
    description: 'Разгрузка, сортировка и учет товаров. Стабильная работа для старта.'
  },
  {
    id: 'farm',
    title: 'Ферма',
    short: 'ФЕР',
    x: 68,
    y: 58,
    pay: 190,
    energy: 8,
    xp: 3,
    skill: 'endurance',
    description: 'Спокойная работа на хозяйстве. Меньше денег, зато мягче по энергии.'
  },
  {
    id: 'service',
    title: 'Сервис',
    short: 'СРВ',
    x: 52,
    y: 34,
    pay: 260,
    energy: 10,
    xp: 4,
    skill: 'charisma',
    description: 'Обслуживание клиентов и мелкие поручения по городу.'
  }
];

const cityJobs = {
  zaporizhzhia: [
    commonJobs[0],
    {
      id: 'factory',
      title: 'Завод',
      short: 'ЗВД',
      x: 66,
      y: 42,
      pay: 350,
      energy: 16,
      xp: 6,
      skill: 'endurance',
      description: 'Производственная смена. Хорошие деньги, высокая усталость.'
    },
    commonJobs[2]
  ],
  odesa: [
    {
      id: 'port',
      title: 'Порт',
      short: 'ПРТ',
      x: 42,
      y: 62,
      pay: 330,
      energy: 15,
      xp: 5,
      skill: 'strength',
      description: 'Погрузка, складирование и работа у причала.'
    },
    {
      id: 'taxi',
      title: 'Такси',
      short: 'ТКС',
      x: 65,
      y: 38,
      pay: 270,
      energy: 9,
      xp: 4,
      skill: 'charisma',
      description: 'Городские поездки и быстрый оборот денег.'
    },
    commonJobs[2]
  ],
  kyiv: [
    {
      id: 'office',
      title: 'Офис',
      short: 'ОФС',
      x: 50,
      y: 38,
      pay: 300,
      energy: 10,
      xp: 5,
      skill: 'intellect',
      description: 'Административная работа, документы и первые деловые связи.'
    },
    {
      id: 'courier',
      title: 'Курьер',
      short: 'КУР',
      x: 34,
      y: 61,
      pay: 260,
      energy: 12,
      xp: 4,
      skill: 'endurance',
      description: 'Доставка заказов по городу.'
    },
    commonJobs[0]
  ],
  lviv: [
    {
      id: 'cafe',
      title: 'Кафе',
      short: 'КФЕ',
      x: 46,
      y: 52,
      pay: 230,
      energy: 8,
      xp: 4,
      skill: 'charisma',
      description: 'Работа с гостями, чаевые и быстрый старт.'
    },
    commonJobs[1],
    commonJobs[2]
  ]
};

const cityNames = {
  vinnytsia: 'Винница',
  lutsk: 'Луцк',
  luhansk: 'Луганск',
  dnipro: 'Днепр',
  donetsk: 'Донецк',
  zhytomyr: 'Житомир',
  uzhhorod: 'Ужгород',
  zaporizhzhia: 'Запорожье',
  'ivano-frankivsk': 'Ивано-Франковск',
  kyiv: 'Киев',
  kropyvnytskyi: 'Кропивницкий',
  crimea: 'Крым',
  lviv: 'Львов',
  mykolaiv: 'Николаев',
  odesa: 'Одесса',
  poltava: 'Полтава',
  rivne: 'Ровно',
  sumy: 'Сумы',
  ternopil: 'Тернополь',
  kharkiv: 'Харьков',
  kherson: 'Херсон',
  khmelnytskyi: 'Хмельницкий',
  cherkasy: 'Черкассы',
  chernihiv: 'Чернигов',
  chernivtsi: 'Черновцы'
};

const aliases = {
  odessa: 'odesa',
  kiev: 'kyiv',
  kiyv: 'kyiv',
  zaporizhia: 'zaporizhzhia',
  zaporozhye: 'zaporizhzhia',
  nikolaev: 'mykolaiv',
  rovno: 'rivne'
};

export function normalizeCityId(cityId) {
  return aliases[cityId] || cityId || 'zaporizhzhia';
}

export function getCity(cityId) {
  const id = normalizeCityId(cityId);
  const fallbackId = cityMaps[id] ? id : 'zaporizhzhia';

  return {
    id: fallbackId,
    name: cityNames[fallbackId] || 'Запорожье',
    map: (cityMaps[fallbackId] || './Zaporozya.png') + '?v=90',
    jobs: cityJobs[fallbackId] || commonJobs
  };
}
