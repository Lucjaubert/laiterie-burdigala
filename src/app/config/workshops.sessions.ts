// src/app/config/workshops.sessions.ts
import { WorkshopSlug } from './workshops.config';

export interface WorkshopSession {
  id: string;
  workshopSlug: WorkshopSlug;
  startAt: string;  // ISO
  endAt: string;    // ISO
  seatsLeft: number;
}

export const WORKSHOP_SESSIONS: WorkshopSession[] = [
  // ✅ Atelier 1 : Réalisez vos mozzarella et burrata
  {
    id: 'sess-001',
    workshopSlug: 'realisez-vos-mozzarella-et-burrata',
    startAt: '2026-03-10T19:00:00',
    endAt: '2026-03-10T20:30:00',
    seatsLeft: 3,
  },
  {
    id: 'sess-002',
    workshopSlug: 'realisez-vos-mozzarella-et-burrata',
    startAt: '2026-03-17T19:00:00',
    endAt: '2026-03-17T20:30:00',
    seatsLeft: 0,
  },

  // ✅ Atelier 2 : Réalisez la célèbre burrata crémeuse
  {
    id: 'sess-010',
    workshopSlug: 'realisez-la-celebre-burrata-cremeuse',
    startAt: '2026-03-14T13:30:00',
    endAt: '2026-03-14T17:00:00',
    seatsLeft: 6,
  },

  // ✅ Atelier 3 : Réalisez et dégustez des mozzarellas en groupe
  {
    id: 'sess-020',
    workshopSlug: 'realisez-et-degustez-des-mozzarellas-en-groupe',
    startAt: '2026-03-12T18:30:00',
    endAt: '2026-03-12T20:00:00',
    seatsLeft: 10,
  },
];
