'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SoftwareSystem, LeadInquiry, AdminMetrics, TeamMember, PlatformSettings } from '@/types';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const [adminUser, setAdminUser] = useState<{ name: string; role: string; email: string } | null>(null);
  const [systems, setSystems] = useState<SoftwareSystem[]>([]);
  const [leads, setLeads] = useState<LeadInquiry[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [settings, setSettings] = useState<PlatformSettings>({
    currency: 'USD',
    companyName: 'NovaSystems',
    companyTagline: 'Software Preconstruido',
    logoUrl: '',
    updatedAt: new Date().toISOString(),
  });
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalSystems: 0,
    totalLeads: 0,
    totalDemoClicks: 0,
    conversionRatePercent: 0,
    topSystems: [],
  });
  const [loading, setLoading] = useState(true);

  // Load initial systems, leads, team and settings
  const fetchData = useCallback(async () => {
    try {
      const [sysRes, leadsRes, teamRes, settingsRes] = await Promise.all([
        fetch('/api/systems'),
        fetch('/api/leads'),
        fetch('/api/team'),
        fetch('/api/settings'),
      ]);

      const sysData = await sysRes.json();
      const leadsData = await leadsRes.json();
      const teamData = await teamRes.json();
      const settingsData = await settingsRes.json();

      if (sysData.success && Array.isArray(sysData.data)) {
        setSystems(sysData.data);
      }

      if (leadsData.success && Array.isArray(leadsData.data)) {
        setLeads(leadsData.data);
        if (leadsData.metrics) {
          setMetrics(leadsData.metrics);
        }
      }

      if (teamData.success && Array.isArray(teamData.data)) {
        setTeam(teamData.data);
      }

      if (settingsData.success && settingsData.data) {
        setSettings(settingsData.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Systems Handlers
  const handleSaveSystem = async (data: Partial<SoftwareSystem>, editingId?: string) => {
    try {
      if (editingId) {
        const res = await fetch(`/api/systems/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) fetchData();
      } else {
        const res = await fetch('/api/systems', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock_admin_token',
          },
          body: JSON.stringify(data),
        });
        if (res.ok) fetchData();
      }
    } catch (err) {
      console.error('Error saving system:', err);
    }
  };

  const handleDeleteSystem = async (id: string) => {
    try {
      const res = await fetch(`/api/systems/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error deleting system:', err);
    }
  };

  // Leads Handlers
  const handleUpdateLeadStatus = async (id: string, status: LeadInquiry['status']) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error updating lead status:', err);
    }
  };

  // Team Handlers (Dev & QA)
  const handleSaveTeamMember = async (data: Omit<TeamMember, 'id'>, editingId?: string) => {
    try {
      if (editingId) {
        const res = await fetch(`/api/team/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) fetchData();
      } else {
        const res = await fetch('/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) fetchData();
      }
    } catch (err) {
      console.error('Error saving team member:', err);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    try {
      const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error deleting team member:', err);
    }
  };

  // Settings Handlers (Company Name, Tagline, Logo, Currency)
  const handleSaveSettings = async (updates: Partial<PlatformSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setSettings(result.data);
      }
    } catch (err) {
      console.error('Error updating settings:', err);
    }
  };

  if (!adminUser) {
    return <AdminLogin onLoginSuccess={(admin) => setAdminUser(admin)} />;
  }

  return (
    <AdminDashboard
      admin={adminUser}
      systems={systems}
      leads={leads}
      team={team}
      settings={settings}
      metrics={metrics}
      onLogout={() => setAdminUser(null)}
      onRefreshData={fetchData}
      onSaveSystem={handleSaveSystem}
      onDeleteSystem={handleDeleteSystem}
      onUpdateLeadStatus={handleUpdateLeadStatus}
      onSaveTeamMember={handleSaveTeamMember}
      onDeleteTeamMember={handleDeleteTeamMember}
      onSaveSettings={handleSaveSettings}
    />
  );
}
