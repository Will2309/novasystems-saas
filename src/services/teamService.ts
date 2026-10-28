import { TeamMember } from '@/types';

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-dev-1',
    name: 'Ing. Mateo Rossi',
    role: 'Principal Software Architect & Tech Lead',
    team: 'dev',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Especialista en Clean Architecture, DDD y optimización de microservicios con más de una década diseñando plataformas transaccionales.',
    specialties: ['Next.js 14/15', 'NestJS', 'PostgreSQL RLS', 'Docker'],
    experienceYears: 12,
    highlightMetric: '99.98% uptime en arquitecturas desplegadas',
  },
  {
    id: 'team-dev-2',
    name: 'Ing. Carlos Varela',
    role: 'Senior Cloud & Backend Engineer',
    team: 'dev',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Experto en escalabilidad de bases de datos, APIs de facturación electrónica y contenedorización para despliegues llave en mano.',
    specialties: ['Go (Golang)', 'Laravel', 'Redis Cache', 'Kubernetes'],
    experienceYears: 8,
    highlightMetric: 'Menos de 30ms en procesamiento de transacciones',
  },
  {
    id: 'team-qa-1',
    name: 'Lic. David Benítez',
    role: 'Lead QA Automation Engineer',
    team: 'qa',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Diseñador de pipelines de pruebas continuas. Garantiza la cobertura integral de flujos críticos de ventas, inventario y facturación.',
    specialties: ['Playwright', 'Vitest', 'Cypress', 'k6 Stress Testing'],
    experienceYears: 9,
    highlightMetric: '+1,800 casos de prueba automatizados',
  },
  {
    id: 'team-qa-2',
    name: 'Ing. Elena Morales',
    role: 'Security & AppSec Vulnerability Auditor',
    team: 'qa',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Auditora de ciberseguridad especializada en hardening de aplicaciones web, sanitización de datos y cumplimiento OWASP Top 10.',
    specialties: ['OWASP Top 10', 'SAST / DAST', 'Argon2id / 2FA', 'Penetration Testing'],
    experienceYears: 7,
    highlightMetric: '0 vulnerabilidades críticas en producción',
  },
];

let teamStore: TeamMember[] = [...INITIAL_TEAM_MEMBERS];

export const TeamService = {
  async getAll(): Promise<TeamMember[]> {
    return [...teamStore];
  },

  async getById(id: string): Promise<TeamMember | null> {
    const member = teamStore.find((m) => m.id === id);
    return member ? { ...member } : null;
  },

  async create(data: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    const newMember: TeamMember = {
      ...data,
      id: `team-${data.team}-${Date.now()}`,
    };
    teamStore.push(newMember);
    return newMember;
  },

  async update(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
    const idx = teamStore.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    teamStore[idx] = { ...teamStore[idx], ...updates };
    return { ...teamStore[idx] };
  },

  async delete(id: string): Promise<boolean> {
    const initialLen = teamStore.length;
    teamStore = teamStore.filter((m) => m.id !== id);
    return teamStore.length < initialLen;
  },
};
