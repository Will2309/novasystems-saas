import { SoftwareSystem, IndustryCategory } from '@/types';
import { INITIAL_SYSTEMS } from '@/lib/mock-data';

// In-memory persistent state (simulating a database repository layer)
let systemsStore: SoftwareSystem[] = [...INITIAL_SYSTEMS];

export const SystemsService = {
  async getAll(category?: IndustryCategory | 'Todos', searchQuery?: string): Promise<SoftwareSystem[]> {
    let result = [...systemsStore];

    if (category && category !== 'Todos') {
      result = result.filter(s => s.category === category);
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.targetBusiness.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.techStack.some(t => t.toLowerCase().includes(q)) ||
          s.modules.some(m => m.toLowerCase().includes(q))
      );
    }

    return result;
  },

  async getById(id: string): Promise<SoftwareSystem | null> {
    const sys = systemsStore.find(s => s.id === id);
    return sys ? { ...sys } : null;
  },

  async create(data: Omit<SoftwareSystem, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>): Promise<SoftwareSystem> {
    const newSystem: SoftwareSystem = {
      ...data,
      id: `sys-${Date.now()}`,
      metrics: {
        demoViews: 0,
        rating: 5.0,
        deployments: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    systemsStore.unshift(newSystem);
    return newSystem;
  },

  async update(id: string, updates: Partial<SoftwareSystem>): Promise<SoftwareSystem | null> {
    const idx = systemsStore.findIndex(s => s.id === id);
    if (idx === -1) return null;

    systemsStore[idx] = {
      ...systemsStore[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return { ...systemsStore[idx] };
  },

  async delete(id: string): Promise<boolean> {
    const initialLen = systemsStore.length;
    systemsStore = systemsStore.filter(s => s.id !== id);
    return systemsStore.length < initialLen;
  },

  async incrementDemoClick(id: string): Promise<number | null> {
    const sys = systemsStore.find(s => s.id === id);
    if (!sys) return null;
    sys.metrics.demoViews += 1;
    sys.updatedAt = new Date().toISOString();
    return sys.metrics.demoViews;
  },
};
