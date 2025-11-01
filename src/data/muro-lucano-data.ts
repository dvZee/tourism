import type { Monument, KnowledgeContent } from '../lib/knowledge-base';

/**
 * Monument data extracted from Muro Lucano guide PDF
 * Source: Muro Lucano - Meraviglia tra cielo e terra
 */

export const monuments: Monument[] = [
  {
    name_it: 'Canyon delle Ripe',
    name_en: 'Ripe Canyon',
    name_es: 'Cañón de las Ripe',
    slug: 'canyon-delle-ripe',
    category: 'nature',
    description_short: 'Un irripetibile paradiso naturale, profonda gola tra pareti di rocce calcaree',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['nature', 'canyon', 'hiking', 'biodiversity'],
    is_featured: true
  },
  {
    name_it: 'Castello',
    name_en: 'Castle',
    name_es: 'Castillo',
    slug: 'castello',
    category: 'monument',
    description_short: 'Castello medievale normanno dell\'XI secolo, corona lucente della città',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['history', 'medieval', 'architecture', 'castle'],
    is_featured: true
  },
  {
    name_it: 'Cattedrale',
    name_en: 'Cathedral',
    name_es: 'Catedral',
    slug: 'cattedrale',
    category: 'religious',
    description_short: 'Cattedrale a croce latina con origini rupestri del XI secolo',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['religion', 'church', 'architecture', 'art'],
    is_featured: true
  },
  {
    name_it: 'Museo Diocesano',
    name_en: 'Diocesan Museum',
    name_es: 'Museo Diocesano',
    slug: 'museo-diocesano',
    category: 'museum',
    description_short: 'Museo che custodisce il prezioso Tesoro di Valadier e i beni della Cattedrale',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['museum', 'art', 'religion', 'valadier'],
    is_featured: false
  },
  {
    name_it: 'Scale d\'Arte e Poesia',
    name_en: 'Art and Poetry Stairs',
    name_es: 'Escaleras de Arte y Poesía',
    slug: 'scale-arte-poesia',
    category: 'art',
    description_short: 'Scalinata con versi di poeti intagliati nelle pietre',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['art', 'poetry', 'culture'],
    is_featured: false
  },
  {
    name_it: 'Museo Archeologico Nazionale',
    name_en: 'National Archaeological Museum',
    name_es: 'Museo Arqueológico Nacional',
    slug: 'museo-archeologico',
    category: 'museum',
    description_short: 'Museo archeologico che racconta la storia della Basilicata Nord-Occidentale',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['museum', 'archaeology', 'history', 'ancient'],
    is_featured: true
  },
  {
    name_it: 'Sentiero delle Ripe',
    name_en: 'Ripe Trail',
    name_es: 'Sendero de las Ripe',
    slug: 'sentiero-delle-ripe',
    category: 'nature',
    description_short: 'Antico sentiero rupestre tra rocce, vegetazione e corsi d\'acqua',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['nature', 'hiking', 'trail', 'medieval'],
    is_featured: false
  },
  {
    name_it: 'Borgo Pianello',
    name_en: 'Pianello Village',
    name_es: 'Pueblo Pianello',
    slug: 'borgo-pianello',
    category: 'village',
    description_short: 'Primo e più antico rione murano, risalente alla fine dell\'800 d.C.',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['history', 'medieval', 'village', 'architecture'],
    is_featured: true
  },
  {
    name_it: 'Casa di San Gerardo Maiella',
    name_en: 'Saint Gerard Maiella House',
    name_es: 'Casa de San Gerardo Maiella',
    slug: 'casa-san-gerardo',
    category: 'religious',
    description_short: 'Casa natale di San Gerardo Maiella, patrono della Basilicata',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['religion', 'saint', 'history', 'museum'],
    is_featured: true
  },
  {
    name_it: 'Belvedere San Nicola',
    name_en: 'San Nicola Belvedere',
    name_es: 'Mirador San Nicola',
    slug: 'belvedere-san-nicola',
    category: 'viewpoint',
    description_short: 'Belvedere panoramico tra i resti delle case e la chiesetta medievale',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['viewpoint', 'panorama', 'architecture'],
    is_featured: false
  },
  {
    name_it: 'Ponte del Pianello',
    name_en: 'Pianello Bridge',
    name_es: 'Puente del Pianello',
    slug: 'ponte-pianello',
    category: 'monument',
    description_short: 'Ponte in calcestruzzo del 1918, prima opera del genere in Basilicata',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['architecture', 'engineering', 'bridge'],
    is_featured: false
  },
  {
    name_it: 'Condotta Forzata Diga Nitti',
    name_en: 'Nitti Dam Pressure Conduit',
    name_es: 'Conducto Forzado Presa Nitti',
    slug: 'condotta-forzata',
    category: 'monument',
    description_short: 'Opera di archeologia industriale, condotta forzata della Diga Nitti',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['engineering', 'industrial', 'history'],
    is_featured: false
  },
  {
    name_it: 'Diga e Lago Artificiale Nitti',
    name_en: 'Nitti Dam and Artificial Lake',
    name_es: 'Presa y Lago Artificial Nitti',
    slug: 'diga-nitti',
    category: 'monument',
    description_short: 'Prima diga artificiale del Sud Italia, importante opera di archeologia industriale',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['engineering', 'industrial', 'history', 'nature'],
    is_featured: true
  },
  {
    name_it: 'Montagna del Bosco Grande',
    name_en: 'Bosco Grande Mountain',
    name_es: 'Montaña del Bosco Grande',
    slug: 'bosco-grande',
    category: 'nature',
    description_short: 'Montagna a 1100 metri con faggi antichi e le grotte dei Vucculi',
    village: 'Muro Lucano',
    region: 'Basilicata',
    tags: ['nature', 'mountain', 'forest', 'caves', 'hiking'],
    is_featured: true
  }
];

export const knowledgeContent: KnowledgeContent[] = [
  // Canyon delle Ripe
  {
    title: 'Canyon delle Ripe - Descrizione',
    content: `Questo è il posto in cui il cielo bacia l'acqua e le ruba la voce. Le Ripe di Muro Lucano sono un irripetibile paradiso naturale sovrascritto dall'opera tutta umana che lo ha attraversato e conquistato. La statua di San Gerardo eretta a protezione e devozione, rivolge lo sguardo e spalanca le braccia verso il cuore urbanizzato della città che a lui guarda, devoto.

La stretta gola nata tra le pareti di rocce calcaree sedimentarie è il letto del fiume Rescio, interrotto a tratti da giganti di roccia caduti a seguito dell'erosione delle profonde e ripide pareti. Macigni e forme carsiche diventano anfratti, gole e piccole grotte ricche di stalattiti e stalagmiti dal fascino misterioso.`,
    content_type: 'description',
    category: 'nature',
    location: 'Canyon delle Ripe',
    tags: ['canyon', 'nature', 'geology', 'fiume rescio'],
    source_page: 15
  },
  {
    title: 'Canyon delle Ripe - Biodiversità',
    content: `Il canyon è un esempio unico di come la natura impervia del luogo abbia stretto un patto di simbiosi con le comunità locali. Felci e licheni ricoprono le rocce ricche di bocche di leone, equiseto, campanule, e garofani selvatici.

Sono varie le specie animali che hanno scelto questo habitat dando vita a specifiche nicchie ecologiche. Il cielo delle Ripe è mappa per poiane, rondoni, nibbi imperiali, gheppi e falchi pellegrini. Oltre al corvo imperiale e alle cicogne nere che tra gli anfratti rocciosi hanno trovato rifugio sicuro.`,
    content_type: 'description',
    category: 'nature',
    location: 'Canyon delle Ripe',
    tags: ['biodiversity', 'flora', 'fauna', 'cicogne nere'],
    source_page: 15
  },
  {
    title: 'Canyon delle Ripe - Storia Industriale',
    content: `Acqua e roccia sposano l'etica della forma. Un complesso sistema di canalizzazione del corso dell'acqua del fiume Rescio e la costruzione dei bellissimi mulini a ruota orizzontale di epoca normanna hanno anticipato la moderna concezione industriale di canalizzazione immaginata da Francesco Saverio Nitti già nei primi anni del 1900.

Il reticolo di gallerie scavate a mano nella roccia si estende per centinaia di metri e raggiunge la condotta forzata, con le caratteristiche giunture inchiodate a mano, il tubo piezometrico e l'arco parabolico di sostegno.`,
    content_type: 'history',
    category: 'industrial',
    location: 'Canyon delle Ripe',
    tags: ['industrial archaeology', 'nitti', 'water mills'],
    source_page: 15
  },

  // Castello
  {
    title: 'Castello - Storia Medievale',
    content: `Nella memoria del tempo l'ombra dell'imponente Castello medievale di Muro Lucano proietta linee e profili sulla roccia secoli prima della sua costruzione. Quello che era stato un piccolo forte di epoca longobarda diventerà nel XI secolo realtà chiara nei progetti di edificazione dei Normanni, giunti sulle colline murane durante la campagna di conquista dell'Italia meridionale.

A partire dal 1269 il castello sarà parte dei beni della Corona. Le vicende legate al castello non furono sempre bagnate dalla luce. Il castello e la torre furono parte del destino crudele della Regina Giovanna I d'Angiò che venne soffocata nel 1382 per ordine di Carlo di Durazzo.`,
    content_type: 'history',
    category: 'monument',
    location: 'Castello',
    tags: ['medieval', 'normans', 'queen giovanna'],
    source_page: 17
  },
  {
    title: 'Castello - Epoca Orsina',
    content: `Nel 1483 il Re di Napoli Ferrante d'Aragona fece del castello una contea del suo regno. Il conte napoletano Mazzeo Ferrillo giunse a Muro Lucano e ridisegnò le fattezze del castello realizzando il ponte levatoio e le due torri. I nuovi spazi accolsero il matrimonio tra sua nipote Beatrice e Ferdinando Orsini, duca di Gravina.

È questo l'inizio dell'età orsina che da Ferdinando attraverserà il tempo e si concluderà solo nel 1806, con l'abolizione dei diritti feudali. La famiglia Orsini intervenne più volte con opere di consolidamento e nuove modifiche all'originario progetto.`,
    content_type: 'history',
    category: 'monument',
    location: 'Castello',
    tags: ['renaissance', 'orsini family', 'nobility'],
    source_page: 17
  },
  {
    title: 'Castello - Restauro Moderno',
    content: `Il sisma del 1980 colpì ancora la struttura. Solo gli Anni Ottanta e gli Anni Novanta segnarono la ricostruzione: le murature, i locali delle scuderie, le stanze e gli ampi ambienti interni si ricomposero riconquistando il cielo e ritrovando il profilo medioevale del progetto originario.

Oggi il Castello è la corona lucente della città. E dalle arcate armoniche della torre costruita accanto all'ingresso affida al tempo i racconti di un popolo fiero e una corrispondenza di versi che Muro e ogni murese ricambiano con enfasi poetica.`,
    content_type: 'description',
    category: 'monument',
    location: 'Castello',
    tags: ['restoration', 'modern', 'tourism'],
    source_page: 17
  },

  // Cattedrale
  {
    title: 'Cattedrale - Architettura',
    content: `La facciata della Cattedrale sembra sospirare davanti alla bellezza del centro lucano adagiato ai suoi piedi. Indossa un abito di luce ispirato ai raggi del sole d'autunno e cela un cuore antico e profondo, oggi parte dell'immenso patrimonio architettonico di Muro Lucano.

La nuova Cattedrale a croce latina ti accoglie con le quattro lesene con capitelli corinzi al di sotto del frontone triangolare. Sono diversi i documenti che fanno risalire le prime fondamenta della cattedrale rupestre interrata al XI secolo.`,
    content_type: 'description',
    category: 'religious',
    location: 'Cattedrale',
    tags: ['architecture', 'church', 'romanesque'],
    source_page: 19
  },
  {
    title: 'Cattedrale - Scoperta Rupestre',
    content: `Per l'intero territorio il sisma del 1980 fu ferita insanabile. La Cattedrale vide distrutti gli affreschi decorativi delle sue volte. Eppure il sisma divenne disvelamento. Al di sotto della cattedrale apparvero le rovine di una chiesa a tre navate e cinque dei totali otto pilastri su cui erano posate. Il sisma svelò anche parte della pavimentazione e uno stipite del portale.`,
    content_type: 'history',
    category: 'religious',
    location: 'Cattedrale',
    tags: ['archaeology', 'earthquake', 'discovery'],
    source_page: 19
  },
  {
    title: 'Cattedrale - Cappella Gerardina e Tesori',
    content: `Le tre cappelle speciali ricavate nella Chiesa sono dedicate a San Gerardo, all'Immacolata e al SS Sacramento. La cappella gerardina fu costruita nel 1895 per celebrare la beatificazione di Gerardo Maiella, mentre nel 1927 Emilio Saggese realizzò la nicchia con decorazioni in marmo e stucco.

Oltre alla Madonna del Rosario dipinta su tavola, la cattedrale ospita 6 oli su tela di Anselmo Palmieri datati 1727-28, il trono episcopale ligneo del 1621 e il suo postergale artistico con baldacchino donato da Benedetto XIII nel 1728.`,
    content_type: 'description',
    category: 'religious',
    location: 'Cattedrale',
    tags: ['art', 'san gerardo', 'religious art'],
    source_page: 19
  },

  // Museo Diocesano
  {
    title: 'Museo Diocesano - Origine e Missione',
    content: `La storia del Museo Diocesano è la contronarrazione, condivisa con la scoperta degli ipogei al di sotto della Cattedrale, di come il sisma del 1980 generò luce. Il Museo Diocesano nasce per fare da culla e dimora ai beni della Cattedrale e di altre chiese muresi che dopo la calamità naturale rischiavano di andare perduti e di subire danni irreversibili.

Il cuore della costruzione rupestre si trova al di sotto del transetto della nuova Cattedrale dove fu scoperta una Cripta a cui si accede attraverso una piccola anticamera.`,
    content_type: 'history',
    category: 'museum',
    location: 'Museo Diocesano',
    tags: ['museum', 'earthquake', 'preservation'],
    source_page: 21
  },
  {
    title: 'Museo Diocesano - Tesoro Valadier',
    content: `Muro Lucano custodisce il servizio in argento dorato per pontificale e i paramenti preziosi del prestigioso Tesoro del Cardinale Orsini realizzato dal maestro Valadier. Luigi Valadier è considerato il più noto e talentuoso orafo, ebanista e fonditore del 1700.

Il tesoro di Valadier conservato a Muro Lucano è considerato uno dei più pregiati lavori del maestro: le opere hanno attraversato il mare per la straordinaria mostra dedicata a Valadier a New York nel 2018 e sono spesso testimoni della grandezza dell'artista in eventi di grande richiamo nazionale e internazionale.`,
    content_type: 'description',
    category: 'museum',
    location: 'Museo Diocesano',
    tags: ['art', 'valadier', 'silverwork', 'treasure'],
    source_page: 21
  },

  // Additional content continues for other monuments...
  // San Gerardo Maiella
  {
    title: 'San Gerardo Maiella - Vita del Santo',
    content: `È qui, al civico 65 del Borgo Pianello, che nasce il 6 aprile 1726 San Gerardo. L'umile casa in cui Gerardo schiuse gli occhi e in cui visse fino a 6/7 anni è irta su pochi gradini che la sollevano di pochi metri rispetto alla viuzza in pietra del Borgo.

Gerardo era unico figlio maschio della famiglia dopo le sorelle Brigida, Anna ed Elisabetta. Fu il luogo in cui fin da piccolo sentì forte lo Spirito e il desiderio ardente di lodare e celebrare Gesù. Dalla casa in vico Celso, andò a bottega presso il vicino sarto del quartiere, Martino Pannuto. A Materdonimi, a soli 29 anni, Gerardo lasciò la vita terrena. Nel cuore la vocazione e la purezza di quello che di sé disse "vado a farmi santo" e santo fu.`,
    content_type: 'history',
    category: 'religious',
    location: 'Casa di San Gerardo Maiella',
    tags: ['saint', 'biography', 'religion', 'patrono basilicata'],
    source_page: 33
  },

  // Events and Food
  {
    title: 'Eventi - Sagra della Patata',
    content: `La Patata di Montagna di Muro Lucano, marchio De.C.O., è celebrata attraverso la Sagra della Patata di Montagna la cui prima edizione è fissata al 2009. L'evento settembrino, tra quelli più noti proposti dalla città di Muro Lucano, ospita più di 20 mila presenze nelle sole tre giornate di manifestazione.

Un momento di riconoscimento alla vocazione dei contadini e delle associazioni locali che hanno contribuito alla salvaguardia del tubero autoctono e al suo recente riconoscimento nazionale.`,
    content_type: 'event',
    category: 'food',
    location: 'Muro Lucano',
    tags: ['festival', 'food', 'potato', 'tradition'],
    source_page: 47
  },
  {
    title: 'Eventi - Festa di San Gerardo',
    content: `La Celebrazione della Festività di San Gerardo, il 2 settembre, è amata per il suo carattere sacro e affettivo. La festa patronale segue di pochi giorni Borgo InVita, straordinario momento di convivialità, musica, bellezza e socialità che accende di note, luci e profumi i vicoli magici di Borgo Pianello.

La festa di San Gerardo include processioni religiose, fuochi d'artificio nella notte sacra e carica di emozione, e rappresenta il momento più importante dell'anno per la comunità murese.`,
    content_type: 'event',
    category: 'religious',
    location: 'Muro Lucano',
    tags: ['festival', 'san gerardo', 'tradition', 'religion'],
    source_page: 47
  },
  {
    title: 'Prodotti Tipici - Eccellenze Gastronomiche',
    content: `Eccellenze territoriali sono il miele, lo zafferano, il tartufo, l'olio, la birra, i fagioli bianchi, i diversi formaggi prodotti nell'area, dal pecorino, al cacioricotta, alla scamorza e al provolone. Menzione speciale per la carne di agnello, la cui qualità è parte determinante nella cultura del lavoro delle aziende del territorio.

Dall'eccezionale e unico clima di montagna alla lunga e complessa tradizione della trasformazione dei prodotti tipici del territorio nasce la mappa della memoria del gusto.`,
    content_type: 'food',
    category: 'food',
    location: 'Muro Lucano',
    tags: ['food', 'local products', 'gastronomy', 'cheese', 'honey'],
    source_page: 47
  },

  // General information
  {
    title: 'Storia - Origini di Numistrum',
    content: `Muro Lucano nasce Numistrum, nella zona che oggi è Raia San Basilio. Numistrum fu teatro della furente battaglia che nel 210 a.C. vide l'eroe Annibale a capo dell'esercito cartaginese e il console romano Claudio Marcello affrontarsi in campo aperto. La battaglia di Numistrum si inserisce tra le vicende della Seconda Guerra Punica.

I racconti di fondazione ricchi di epica e poesia sono un canto celebrativo che danza sulla linea del tempo e della leggenda che si toccano sull'arco del ponte romano edificato intorno al 1100.`,
    content_type: 'history',
    category: 'history',
    location: 'Muro Lucano',
    tags: ['ancient history', 'roman', 'hannibal', 'numistrum'],
    source_page: 7
  },
  {
    title: 'Storia - Medioevo e Pianello',
    content: `Tra purezza e incanto, le prime comunità scelsero intorno al IX secolo il Pianello, il luogo più inaccessibile tra gli aguzzi spuntoni di rocce e qui nacquero i primi insediamenti. Il bisogno dell'acqua disegnerà la strada delle Ripe, percorsa quotidianamente dagli abitanti del Pianello fino alla Fontana delle Ripe.

Nel periodo normanno-svevo, l'arte e il lavoro diedero forma e necessità alla costruzione della gualchiera e di un mulino. Alle prime infrastrutture seguirono negli anni successivi diverse nuove costruzioni indispensabili all'economia e alla lavorazione delle materie prime.`,
    content_type: 'history',
    category: 'history',
    location: 'Borgo Pianello',
    tags: ['medieval', 'settlement', 'urban development'],
    source_page: 7
  },
  {
    title: 'Personaggi Illustri - Joseph Stella',
    content: `Joseph Stella, primo pittore futurista d'America, nato a Muro Lucano nel giugno 1877. Percorsi di vita in cui brilla la città, tratteggiata così da Joseph Stella che definì la contemplazione delle bellezze della città "lo schiudersi repentino di una luce, fragore come cascata celeste, esplosione d'oro di un tramonto autunnale in cima ad uno dei miei monti".

Nelle opere dell'artista futurista l'America ammirò linee e tratti che sembrano rievocare scorci muresi eco delle Ripe.`,
    content_type: 'story',
    category: 'culture',
    location: 'Muro Lucano',
    tags: ['art', 'futurism', 'famous people', 'joseph stella'],
    source_page: 9
  },
  {
    title: 'Personaggi Illustri - Ron Galella',
    content: `Ron Galella, il più famoso fotografo delle star, nato a New York nel 1931 e figlio di Vincenzo Galella, ebanista nato a Muro Lucano. Il Godfather of U.S. Paparazzi culture ha costruito con i suoi scoop l'immaginario collettivo delle star del suo tempo, creando uno stile personalissimo di grande impatto.

Una mostra permanente degli scatti di Ron Galella è ospitata presso il Museo Archeologico Nazionale.`,
    content_type: 'story',
    category: 'culture',
    location: 'Muro Lucano',
    tags: ['photography', 'famous people', 'ron galella', 'celebrity'],
    source_page: 9
  }
];
