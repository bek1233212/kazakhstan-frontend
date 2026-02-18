export interface Destination {
  id: string;
  name: string;
  location: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  gallery: string[];
  features: string[];
  type: 'Nature' | 'City' | 'History';
}

export const destinations: Destination[] = [
  {
    id: 'tien-shan',
    name: 'Tien Shan Mountains',
    location: 'Southeast Kazakhstan',
    shortDescription: 'The Celestial Mountains offer spectacular alpine scenery.',
    fullDescription: 'The Tien Shan range, meaning "Celestial Mountains," provides an incredible backdrop for hikers and mountaineers alike. Home to snow-capped peaks and pristine glaciers, it is one of the most magnificent mountain systems in Central Asia.',
    image: '/destinations-photos/bg-mountain.jpg',
    gallery: [
      '/destinations-photos/bg-mountain.jpg',
      '/destinations-photos/mountain-1.jpg',
      '/destinations-photos/mountain-2.jpg',
      '/destinations-photos/mountain-3.jpg',
      '/destinations-photos/mountain-4.jpg'
    ],
    features: ['High Peaks', 'Glacial Lakes', 'Hiking Routes', 'Rare Wildlife'],
    type: 'Nature'
  },
  {
    id: 'charyn-canyon',
    name: 'Charyn Canyon',
    location: 'Almaty Region',
    shortDescription: 'Dramatic rock formations often called the "Grand Canyon\'s brother."',
    fullDescription: 'Carved over millions of years by the Charyn River, this red sandstone labyrinth features the famous Valley of Castles. The vibrant orange walls reach heights of 300 meters, showcasing stunning geological history.',
    image: '/destinations-photos/bg-canyon.jpg',
    gallery: [
      '/destinations-photos/bg-canyon.jpg',
      '/destinations-photos/canyon-1.jpg',
      '/destinations-photos/canyon-2.jpg',
      '/destinations-photos/canyon-3.jpg',
      '/destinations-photos/canyon-4.jpg'
    ],
    features: ['Valley of Castles', 'River Hiking', 'Photography', 'Camping'],
    type: 'Nature'
  },
  {
    id: 'lake-kaindy',
    name: 'Lake Kaindy',
    location: 'Tien Shan Mountains',
    shortDescription: 'The famous underwater forest created in 1911.',
    fullDescription: 'Famous for its sunken forest, Lake Kaindy features Schrenk’s spruce trunks rising out of the turquoise water. The cold water preserves the needles on the branches underwater, creating a surreal landscape.',
    image: '/destinations-photos/bg-lake.jpg',
    gallery: [
      '/destinations-photos/bg-lake.jpg',
      '/destinations-photos/kaindy-1.jpg',
      '/destinations-photos/kaindy-2.jpg',
      '/destinations-photos/kaindy-3.jpg',
      '/destinations-photos/kaindy-4.jpg'
    ],
    features: ['Underwater Forest', 'Turquoise Water', 'Photography', 'Horseback Riding'],
    type: 'Nature'
  },
  {
    id: 'altyn-emel',
    name: 'Altyn Emel National Park',
    location: 'Almaty Region',
    shortDescription: 'Home to the mysterious Singing Dunes.',
    fullDescription: 'A vast protected area featuring the mysterious Singing Dunes, which hum in dry weather. The park also includes the colorful Aktau mountains and ancient petroglyphs.',
    image: '/destinations-photos/bg-altyn.png',
    gallery: [
      '/destinations-photos/bg-altyn.png',
      '/destinations-photos/altyn-1.jpg',
      '/destinations-photos/altyn-2.jpg',
      '/destinations-photos/altyn-3.jpg',
      '/destinations-photos/altyn-4.jpg'
    ],
    features: ['Singing Dunes', 'Aktau Mountains', 'Petroglyphs', 'Safari Tours'],
    type: 'Nature'
  },
  {
    id: 'kolsai-lakes',
    name: 'Kolsai Lakes',
    location: 'Northern Tien Shan',
    shortDescription: 'The "Pearls of the Tien Shan" cascading down mountain valleys.',
    fullDescription: 'A system of three alpine lakes surrounded by dense spruce forests. These "Pearls of the Northern Tien Shan" are famous for their mirror-like surfaces and clear mountain air.',
    image: '/destinations-photos/bg-kolsay.jpg',
    gallery: [
      '/destinations-photos/bg-kolsay.jpg',
      '/destinations-photos/kolsay-1.jpg',
      '/destinations-photos/kolsay-2.jpg',
      '/destinations-photos/kolsay-3.jpg',
      '/destinations-photos/kolsay-4.jpg'
    ],
    features: ['Alpine Lakes', 'Boating', 'Spruce Forests', 'Eco-lodges'],
    type: 'Nature'
  },
  {
    id: 'turkistan',
    name: 'Turkistan',
    location: 'South Kazakhstan',
    shortDescription: 'One of Kazakhstans oldest cities and a UNESCO site.',
    fullDescription: 'Home to the Mausoleum of Khoja Ahmed Yasawi, a masterpiece of Timurid architecture. Turkistan is a major pilgrimage site and a window into the country\'s Silk Road history.',
    image: '/destinations-photos/bg-turk.jpg',
    gallery: [
      '/destinations-photos/bg-turk.jpg',
      '/destinations-photos/turk-1.jpg',
      '/destinations-photos/turk-2.jpg',
      '/destinations-photos/turk-3.jpg',
      '/destinations-photos/turk-4.jpg'
    ],
    features: ['UNESCO Site', 'Timurid Architecture', 'Silk Road History', 'Cultural Center'],
    type: 'History'
  }
];
