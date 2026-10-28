export const COUPLE = {
  her: 'Gappy',
  herFull: 'Amy',
  him: 'Eddy',
  date: '27.10.2024',
  dateLong: '27 de octubre de 2024',
} as const

export const STAMPS = [
  { id: 'entrada', label: 'Entrada', short: 'I' },
  { id: 'gabinete', label: 'Gabinete', short: 'II' },
  { id: 'sala-punteria', label: 'Puntería', short: 'III' },
  { id: 'sala-magia', label: 'Magia', short: 'IV' },
  { id: 'sala-dulces', label: 'Dulces', short: 'V' },
  { id: 'ruleta', label: 'Ruleta', short: 'VI' },
  { id: 'final', label: 'Gran función', short: 'VII' },
] as const

export type StampId = (typeof STAMPS)[number]['id']

export type SalaId = 'punteria' | 'magia' | 'dulces'

export const SALAS: Record<
  SalaId,
  {
    id: SalaId
    stamp: StampId
    name: string
    kicker: string
    description: string
    color: string
  }
> = {
  punteria: {
    id: 'punteria',
    stamp: 'sala-punteria',
    name: 'Sala de puntería',
    kicker: 'Puntería, pulso y paciencia',
    description:
      'Globos, peces, platos y una cuerda floja. Aquí se gana con la puntería y se pierde con la risa.',
    color: '#D946EF',
  },
  magia: {
    id: 'magia',
    stamp: 'sala-magia',
    name: 'Sala de magia',
    kicker: 'Lo que no se explica',
    description:
      'Una pitonisa, una caja fuerte, cartas y espejos. Todo parece truco hasta que te toca mirar de cerca.',
    color: '#7C3AED',
  },
  dulces: {
    id: 'dulces',
    stamp: 'sala-dulces',
    name: 'Sala de dulces',
    kicker: 'Palomitas, bingo y deseos',
    description:
      'La sala más golosa: palomitas, un bingo, un pozo y un fotomatón de papel. Sin fotos, prometido.',
    color: '#C9A227',
  },
}

export type FunctionStory = {
  id: string
  icon: 'candle' | 'chess' | 'clock'
  kicker: string
  title: string
  object: string
  body: string[]
  note: string
}

export const FUNCTIONS: FunctionStory[] = [
  {
    id: 'vela',
    icon: 'candle',
    kicker: 'Función privada · 01',
    title: 'El culto de las miradas',
    object: 'Una vela que no debía encenderse',
    body: [
      'Nos metimos en un culto con la excusa más tonta y la razón más grande: vernos un rato más.',
      'No recuerdo el sermón. Recuerdo tu cara de estar calculando cuánto faltaba para que nos dejaran salir juntos.',
      'Si aquello era un culto, yo estaba rezando por otra cosa.',
    ],
    note: 'A veces lo sagrado no está en el altar. Está en la butaca del fondo, a tu lado.',
  },
  {
    id: 'peon',
    icon: 'chess',
    kicker: 'Función privada · 02',
    title: 'Jaque mate, Gappy',
    object: 'Un peón que se negó a dejarte ganar',
    body: [
      'Jugamos ajedrez en el parque y yo entré pensando que iba a dejarte ganar. Luego moví un peón y se me olvidó la caballerosidad.',
      'Te quejaste. Con razón. Y aun así seguiste jugando.',
      'Aprendí que contigo hasta una derrota tiene algo de plan.',
    ],
    note: 'P.D. La revancha sigue pendiente. Esta vez prometo pensar antes de mover.',
  },
  {
    id: 'reloj',
    icon: 'clock',
    kicker: 'Función privada · 03',
    title: 'La fuga',
    object: 'Un reloj que se quedó sin excusas',
    body: [
      'Te escapaste del trabajo para verme. No era el plan más responsable del mundo, pero fue nuestro.',
      'Llegaste con esa cara de quien acaba de hacer algo prohibido y no piensa pedir perdón.',
      'Si hay que volver a escaparse, yo llevo la llave.',
    ],
    note: 'Las mejores horas no salen en ningún horario.',
  },
]

export const CURIOSITIES = [
  {
    id: 'entrada',
    icon: 'ticket' as const,
    title: 'La primera entrada',
    body: 'La guardo como si fuera una reliquia. No lo es. Pero casi.',
    note: 'Válida para una función que todavía no ha terminado.',
  },
  {
    id: 'palomitas',
    icon: 'popcorn' as const,
    title: 'Palomitas de domingo',
    body: 'El cubo siempre se acaba antes que la película. Tú dices que no. Yo sé que sí.',
    note: 'La próxima vez compramos dos. O tres.',
  },
  {
    id: 'llave',
    icon: 'key' as const,
    title: 'La llave de lo que sigue',
    body: 'No abre ninguna puerta todavía. La estoy guardando para la próxima función.',
    note: 'Pesa poco. Insiste mucho.',
  },
]

export const PLANS = [
  'Revancha de ajedrez, sin trampas (o casi).',
  'Cine con manta y palomitas que duren toda la película.',
  'Cocinar algo demasiado ambicioso y pedir pizza después.',
  'Escapada de un día sin mirar el reloj.',
  'Domingo entero sin planes, solo contigo.',
  'Maratón de Deltarune y dormirnos en el sofá.',
  'Noche de feria de verdad: algodón, luces y fotos que no salgan.',
  'Repetir la fuga, pero esta vez sin volver tan pronto.',
]

export const PREDICTIONS = [
  'Veo una revancha de ajedrez. Y veo a Eddy perdiendo con dignidad.',
  'Veo palomitas, una manta y una película que nadie va a terminar.',
  'Veo una fuga nueva. Esta vez la llave la llevas tú.',
  'Veo un domingo sin reloj y con el teléfono en silencio.',
  'Veo una discusión absurda sobre dónde comer y una solución: los dos.',
  'Veo una foto movida. En la foto salen los dos, pero se ríen más que posan.',
  'Veo una noche de feria con luces moradas y algodón de azúcar.',
  'Veo a Eddy diciendo “una partida más” y a Gappy diciendo “ya”.',
  'Veo una canción que se repite hasta que uno de los dos canta mal.',
  'Veo una siesta que empieza a las seis y termina siendo noche.',
  'Veo una promesa pequeña que se cumple. Esas son las que importan.',
  'Veo otra función. Siempre otra función.',
]

export const BALLOONS = [
  'Gappy',
  'Mi persona favorita',
  'Revancha',
  'Palomitas',
  'Otra función',
  'Para siempre',
]

export const HEARTS = [
  'Tu risa antes de terminar la frase.',
  'Tu cara cuando sabes que tienes razón.',
  'Las tardes que empiezan sin plan.',
  'Tu forma de decir “ya” y quedarte una hora más.',
  'Los planes que se caen y mejoran.',
  'La próxima fuga.',
]

export const WISHES = [
  'Que la próxima fuga sea juntos.',
  'Que nunca nos falten planes malos.',
  'Que el ajedrez no arruine la cita.',
  'Que siempre haya palomitas.',
  'Que sigas siendo mi Gappy.',
  'Que esta función tenga muchas reposiciones.',
]

export const PLATES = [
  'Equilibrio: tú, yo y lo que se nos cae.',
  'Un plato más y decimos que fue idea mía.',
  'La torre se tambalea, pero no se rinde.',
  'Así estamos nosotros: un poco torcidos y de pie.',
  'El secreto es no mirar demasiado abajo.',
  'Si se cae, lo recogemos y pedimos otro.',
  'Nada importante se sostiene sin pulso.',
  'Otra función de equilibrio, por favor.',
]

export const POPCORN_NOTES = [
  'Tu risa es la mejor parte de la película.',
  'Contigo hasta los créditos finales.',
  'Un grano más y digo “te quiero”.',
  'No comparto palomitas. Contigo hago excepción.',
  'El cubo se acaba. La costumbre no.',
  'Esta noche ganan las palomitas.',
  'Un grano por cada vez que te reíste.',
  'La manta es nuestra, el sofá también.',
  'Nada de salir temprano.',
  'Otra película, otra excusa.',
  'Me gusta el ruido de la máquina.',
  'La última siempre es la mejor.',
]

export const BINGO_MOMENTS = [
  'Culto solo para verse',
  'Ajedrez en el parque',
  'Fuga del trabajo',
  'Palomitas de domingo',
  'Deltarune hasta tarde',
  'Plan que empieza con “solo un rato”',
  'Foto movida',
  'Siesta de seis a nueve',
  'Te quiero dicho en voz baja',
]

export const BINGO_LINES = [
  'Línea de las miradas: ya sabía que iba a pasar.',
  'Línea de los planes: ninguno salió como estaba escrito.',
  'Línea de las tonterías: mi favorita.',
  'Línea de la siesta: perdimos la tarde y ganamos el día.',
  'Línea de las palomitas: otra vez sin fondo.',
]

export const MEMORY_PAIRS = [
  {
    id: 'corazon',
    symbol: 'heart' as const,
    label: 'Corazón',
    phrase: 'Elegirte sigue siendo mi jugada favorita.',
  },
  {
    id: 'carpa',
    symbol: 'tent' as const,
    label: 'Carpa',
    phrase: 'Mi lugar favorito es donde estés tú.',
  },
  {
    id: 'peon',
    symbol: 'chess' as const,
    label: 'Peón',
    phrase: 'Contigo hasta perder tiene gracia.',
  },
  {
    id: 'reloj',
    symbol: 'clock' as const,
    label: 'Reloj',
    phrase: 'Las horas contigo se portan mal.',
  },
  {
    id: 'estrella',
    symbol: 'sparkle' as const,
    label: 'Estrella',
    phrase: 'No necesito cielo si estás en la misma habitación.',
  },
  {
    id: 'palomitas',
    symbol: 'popcorn' as const,
    label: 'Palomitas',
    phrase: 'Lo comparto todo menos las palomitas. Bueno, contigo sí.',
  },
]

export const CAROUSEL_MEMORIES = [
  {
    title: 'El día que empezó todo',
    body: 'No hubo fanfarria. Hubo una conversación que se alargó y una sensación rara de que el resto del mundo podía esperar.',
  },
  {
    title: 'El parque',
    body: 'Un tablero, dos egoístas y una tarde que se quedó corta. El peón sigue ahí, en el bolsillo de la memoria.',
  },
  {
    title: 'La fuga',
    body: 'El reloj decía una cosa y tú decías otra. Ganaste tú. Ganamos los dos.',
  },
  {
    title: 'Los domingos',
    body: 'Película, manta y un cubo de palomitas que nunca llega al final. La mejor parte es el reparto.',
  },
  {
    title: 'Las canciones',
    body: 'Hay canciones que ya son nuestras aunque no las hayamos escrito. Esta es una de ellas.',
  },
  {
    title: 'Lo que falta',
    body: 'Más feria, más revanchas, más siestas, más planes que se caen. La lista sigue abierta.',
  },
]

export const MIRRORS = [
  {
    title: 'Lo que veo cuando te miro',
    body: 'Veo a la persona con la que quiero discutir de tonterías y arreglar el mundo en la misma tarde.',
  },
  {
    title: 'Lo que me gusta de ti',
    body: 'Tu forma de reírte antes de terminar la frase. Como si ya supieras que me vas a ganar.',
  },
  {
    title: 'Lo que aprendí contigo',
    body: 'Que el amor también es quedarse cuando el plan se cae y no hay nada que hacer.',
  },
  {
    title: 'Lo que quiero que siga',
    body: 'Las funciones dobles, los planes mal hechos y las fugas que terminan en casa.',
  },
]

export const LETTER = {
  greeting: 'Gappy:',
  paragraphs: [
    'No sé si el circo se inventó para que la gente se mirara sin tener que decirlo todo. Pero si es así, nosotros llevamos un tiempo haciendo una función privada.',
    'Me gusta que seas la persona con la que puedo ir a un culto solo para verte, jugar al ajedrez y perder la compostura, o escaparme del trabajo para que una tarde normal se vuelva una historia.',
    'No quiero una vida perfecta. Quiero una vida con función doble: las partes bonitas, las tonterías, los planes que se caen y las palomitas que se acaban antes de tiempo.',
    'Si esto fuera una carta de circo, pediría otra entrada. Y otra. Y todas las que me dejes comprar contigo.',
    'Te quiero, Gappy. Con confeti y sin él.',
  ],
  ps: 'P.D. La próxima fuga la planeo yo. Llevo la llave.',
}

export const FINAL_OPTIONS = [
  'Sí, siempre',
  'Sí, pero con palomitas',
] as const

export const POSTCARD_HATS = ['Ninguno', 'Copa', 'Corona', 'Lazo'] as const
export const POSTCARD_EXTRAS = ['Ninguno', 'Pajarita', 'Gafas de corazón', 'Bigote de papel'] as const
export const POSTCARD_FRAMES = ['Estrellas', 'Bombillas', 'Cortinas'] as const

export const SOUNDTRACK_CREDIT = {
  title: 'The World Revolving',
  artist: 'Toby Fox',
  work: 'Deltarune',
  url: 'https://tobyfox.bandcamp.com/',
} as const
