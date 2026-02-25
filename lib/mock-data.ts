export type SessionStatus = 'draft' | 'active' | 'canvas' | 'closed';

export interface Session {
  id: string;
  name: string;
  company: string;
  status: SessionStatus;
  groupCount: number;
  totalCards: number;
  cardsValued: number;
  createdAt: string;
  decks: string[];
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  isDefault: boolean;
  cards: CardItem[];
}

export interface CardItem {
  id: string;
  text: string;
  category?: string;
  deckId: string;
}

export interface Group {
  id: string;
  name: string;
  code: string;
  sessionId: string;
  connectedDevices: number;
  cardsValued: number;
  totalCards: number;
  likes: number;
}

export interface CanvasPosition {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  quadrant: 'ahora-preparados' | 'futuro-preparados' | 'ahora-no-preparados' | 'futuro-no-preparados';
}

export interface CardResult {
  id: string;
  text: string;
  likes: number;
  dislikes: number;
  relevanceScore: number;
  groups: string[];
  comments: string[];
  canvasPosition?: CanvasPosition;
}

export const mockSessions: Session[] = [
  {
    id: '1',
    name: 'Transformación Digital Q1',
    company: 'TechCorp',
    status: 'active',
    groupCount: 4,
    totalCards: 40,
    cardsValued: 28,
    createdAt: '2026-02-10',
    decks: ['Innovación', 'Procesos'],
  },
  {
    id: '2',
    name: 'Cultura Organizacional',
    company: 'InnovateCo',
    status: 'draft',
    groupCount: 3,
    totalCards: 30,
    cardsValued: 0,
    createdAt: '2026-02-09',
    decks: ['Cultura', 'Liderazgo'],
  },
  {
    id: '3',
    name: 'Estrategia 2026',
    company: 'GlobalInc',
    status: 'canvas',
    groupCount: 5,
    totalCards: 50,
    cardsValued: 50,
    createdAt: '2026-02-05',
    decks: ['Estrategia', 'Mercado'],
  },
  {
    id: '4',
    name: 'Onboarding Participant',
    company: 'StartupXYZ',
    status: 'closed',
    groupCount: 2,
    totalCards: 20,
    cardsValued: 20,
    createdAt: '2026-01-20',
    decks: ['Onboarding'],
  },
];

export const mockDecks: Deck[] = [
  {
    id: '1',
    name: 'Innovación y Tecnología',
    description: 'Cartas sobre transformación digital, IA, automatización',
    cardCount: 15,
    isDefault: true,
    cards: [
      { id: 'c1', text: 'Implementar IA generativa en procesos de atención al cliente', deckId: '1' },
      { id: 'c2', text: 'Automatizar flujos de trabajo repetitivos con RPA', deckId: '1' },
      { id: 'c3', text: 'Adoptar arquitectura cloud-native para nuevos servicios', deckId: '1' },
      { id: 'c4', text: 'Crear un laboratorio de innovación interno', deckId: '1' },
      { id: 'c5', text: 'Implementar análisis predictivo para toma de decisiones', deckId: '1' },
    ],
  },
  {
    id: '2',
    name: 'Cultura y Liderazgo',
    description: 'Cartas sobre cultura empresarial, liderazgo y comunicación',
    cardCount: 12,
    isDefault: true,
    cards: [
      { id: 'c6', text: 'Fomentar una cultura de feedback continuo', deckId: '2' },
      { id: 'c7', text: 'Crear programas de mentoría cross-funcional', deckId: '2' },
      { id: 'c8', text: 'Implementar modelo de liderazgo distribuido', deckId: '2' },
    ],
  },
  {
    id: '3',
    name: 'Procesos y Eficiencia',
    description: 'Cartas sobre optimización de procesos y productividad',
    cardCount: 10,
    isDefault: false,
    cards: [
      { id: 'c9', text: 'Rediseñar el proceso de onboarding de clientes', deckId: '3' },
      { id: 'c10', text: 'Implementar metodología Lean en operaciones', deckId: '3' },
    ],
  },
];

export const mockGroups: Group[] = [
  { id: 'g1', name: 'Mesa 1', code: 'A7KD2', sessionId: '1', connectedDevices: 1, cardsValued: 12, totalCards: 40, likes: 8 },
  { id: 'g2', name: 'Mesa 2', code: 'B3MF7', sessionId: '1', connectedDevices: 1, cardsValued: 8, totalCards: 40, likes: 5 },
  { id: 'g3', name: 'Mesa 3', code: 'C9PL4', sessionId: '1', connectedDevices: 0, cardsValued: 5, totalCards: 40, likes: 3 },
  { id: 'g4', name: 'Mesa 4', code: 'D1QR8', sessionId: '1', connectedDevices: 1, cardsValued: 3, totalCards: 40, likes: 2 },
];

export const mockResults: CardResult[] = [
  { id: 'c1', text: 'Implementar IA generativa en procesos de atención al cliente', likes: 14, dislikes: 2, relevanceScore: 87, groups: ['Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4'], comments: ['Prioritario para 2026', 'Ya tenemos piloto en marcha'], canvasPosition: { x: 72, y: 22, quadrant: 'futuro-preparados' } },
  { id: 'c4', text: 'Crear un laboratorio de innovación interno', likes: 12, dislikes: 4, relevanceScore: 75, groups: ['Mesa 1', 'Mesa 2', 'Mesa 3'], comments: ['Necesita presupuesto dedicado'], canvasPosition: { x: 78, y: 68, quadrant: 'futuro-no-preparados' } },
  { id: 'c6', text: 'Fomentar una cultura de feedback continuo', likes: 11, dislikes: 3, relevanceScore: 78, groups: ['Mesa 1', 'Mesa 2', 'Mesa 4'], comments: [], canvasPosition: { x: 25, y: 30, quadrant: 'ahora-preparados' } },
  { id: 'c2', text: 'Automatizar flujos de trabajo repetitivos con RPA', likes: 10, dislikes: 6, relevanceScore: 62, groups: ['Mesa 1', 'Mesa 3'], comments: ['Alta divergencia entre mesas'], canvasPosition: { x: 30, y: 72, quadrant: 'ahora-no-preparados' } },
  { id: 'c9', text: 'Rediseñar el proceso de onboarding de clientes', likes: 9, dislikes: 5, relevanceScore: 64, groups: ['Mesa 2', 'Mesa 4'], comments: [], canvasPosition: { x: 65, y: 35, quadrant: 'futuro-preparados' } },
  { id: 'c3', text: 'Adoptar arquitectura cloud-native para nuevos servicios', likes: 8, dislikes: 8, relevanceScore: 50, groups: ['Mesa 1'], comments: ['Muy técnica, dividida'] },
  { id: 'c7', text: 'Crear programas de mentoría cross-funcional', likes: 7, dislikes: 3, relevanceScore: 70, groups: ['Mesa 3', 'Mesa 4'], comments: [], canvasPosition: { x: 20, y: 25, quadrant: 'ahora-preparados' } },
];
