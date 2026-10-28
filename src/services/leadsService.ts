import { LeadInquiry, AdminMetrics } from '@/types';
import { INITIAL_LEADS } from '@/lib/mock-data';
import { SystemsService } from './systemsService';

let leadsStore: LeadInquiry[] = [...INITIAL_LEADS];

export const LeadsService = {
  async getAll(): Promise<LeadInquiry[]> {
    return [...leadsStore].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async create(data: Omit<LeadInquiry, 'id' | 'createdAt' | 'status'>): Promise<LeadInquiry> {
    const newLead: LeadInquiry = {
      ...data,
      id: `lead-${Date.now()}`,
      status: 'Nuevo',
      createdAt: new Date().toISOString(),
    };
    leadsStore.unshift(newLead);

    // Simulate Webhook dispatch to Telegram / Email in production
    this.dispatchTelegramNotification(newLead).catch(console.error);

    return newLead;
  },

  async updateStatus(id: string, status: LeadInquiry['status']): Promise<LeadInquiry | null> {
    const lead = leadsStore.find(l => l.id === id);
    if (!lead) return null;
    lead.status = status;
    return { ...lead };
  },

  async getAdminMetrics(): Promise<AdminMetrics> {
    const systems = await SystemsService.getAll();
    const totalDemoClicks = systems.reduce((acc, curr) => acc + (curr.metrics.demoViews || 0), 0);
    const totalLeads = leadsStore.length;

    const conversionRatePercent = totalDemoClicks > 0
      ? Number(((totalLeads / totalDemoClicks) * 100).toFixed(2))
      : 0;

    const topSystems = systems
      .map(s => ({
        id: s.id,
        title: s.title,
        clicks: s.metrics.demoViews,
        category: s.category,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    return {
      totalSystems: systems.length,
      totalLeads,
      totalDemoClicks,
      conversionRatePercent,
      topSystems,
    };
  },

  async dispatchTelegramNotification(lead: LeadInquiry): Promise<void> {
    // In production, this dispatches to https://api.telegram.org/bot<TOKEN>/sendMessage
    // or an SMTP provider like Resend / SendGrid
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        const text = `🚀 *Nuevo Lead Recibido - NovaSystems Pro*\n\n` +
          `👤 *Cliente:* ${lead.fullName}\n` +
          `🏢 *Empresa:* ${lead.companyName || 'No indicada'}\n` +
          `📧 *Email:* ${lead.email}\n` +
          `📱 *Teléfono:* ${lead.phone}\n` +
          `📦 *Sistema:* ${lead.systemTitle || lead.systemId}\n` +
          `💬 *Mensaje:* ${lead.message}`;

        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text,
            parse_mode: 'Markdown',
          }),
        });
      } catch (err) {
        console.error('[Notification Dispatch Error]', err);
      }
    }
  },
};
