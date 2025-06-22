export const mockPhotos = [
  {
    id: '1',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80',
    title: 'Casamento dos Sonhos',
    category: 'wedding',
    uploadDate: '2024-01-15T10:30:00Z',
    likes: 45,
    rating: 4.8,
    ratingCount: 23,
    description: 'Um momento único e especial capturado no grande dia'
  },
  {
    id: '2',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80',
    title: 'Retrato Elegante',
    category: 'portrait',
    uploadDate: '2024-01-10T14:20:00Z',
    likes: 32,
    rating: 4.6,
    ratingCount: 18,
    description: 'Retrato profissional com iluminação perfeita'
  },
  {
    id: '3',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80',
    title: 'Evento Corporativo',
    category: 'event',
    uploadDate: '2024-01-08T09:15:00Z',
    likes: 28,
    rating: 4.4,
    ratingCount: 15,
    description: 'Cobertura completa de evento empresarial'
  },
  {
    id: '4',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&q=80',
    title: 'Família Unida',
    category: 'family',
    uploadDate: '2024-01-05T16:45:00Z',
    likes: 67,
    rating: 4.9,
    ratingCount: 34,
    description: 'Sessão familiar ao ar livre com luz natural'
  },
  {
    id: '5',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
    title: 'Natureza Pura',
    category: 'nature',
    uploadDate: '2024-01-03T11:30:00Z',
    likes: 89,
    rating: 4.7,
    ratingCount: 42,
    description: 'Paisagem natural capturada no momento perfeito'
  },
  {
    id: '6',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c26a?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1520637836862-4d197d17c26a?w=400&q=80',
    title: 'Arquitetura Moderna',
    category: 'architecture',
    uploadDate: '2024-01-01T18:20:00Z',
    likes: 41,
    rating: 4.5,
    ratingCount: 27,
    description: 'Detalhes arquitetônicos em perspectiva única'
  }
];

export const mockVideos = [
  {
    id: '7',
    type: 'video',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80',
    title: 'Highlights do Casamento',
    category: 'wedding',
    uploadDate: '2024-01-12T13:00:00Z',
    likes: 156,
    rating: 4.9,
    ratingCount: 67,
    description: 'Os melhores momentos do grande dia em vídeo',
    duration: '02:30'
  },
  {
    id: '8',
    type: 'video',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&q=80',
    title: 'Time-lapse Urbano',
    category: 'urban',
    uploadDate: '2024-01-06T20:15:00Z',
    likes: 203,
    rating: 4.8,
    ratingCount: 89,
    description: 'A cidade em movimento capturada em time-lapse',
    duration: '01:45'
  }
];

export const mockCategories = [
  { id: 'all', name: 'Todas', count: 8 },
  { id: 'wedding', name: 'Casamentos', count: 2 },
  { id: 'portrait', name: 'Retratos', count: 1 },
  { id: 'event', name: 'Eventos', count: 1 },
  { id: 'family', name: 'Família', count: 1 },
  { id: 'nature', name: 'Natureza', count: 1 },
  { id: 'architecture', name: 'Arquitetura', count: 1 },
  { id: 'urban', name: 'Urbano', count: 1 }
];