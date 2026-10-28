'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SoftwareSystem, LeadInquiry, AdminMetrics, CurrencyCode } from '@/types';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const [adminUser, setAdminUser] = useState<{ name: string; role: string; email: string } | null>(null);
  const [systems, setSystems] = useState<SoftwareSystem[]>([]);
  const [leads, setLeads] = useState<LeadInquiry[]>([]);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalSystems: 0,
    totalLeads: 0,
    totalDemoClicks: 0,
    conversionRatePercent: 0,
    topSystems: [],
  });
  const [loading, setLoading] = useState(true);

  // Load initial systems, leads and settings
  const fetchData = useCallback(async () => {
    try {
      const [sysRes, leadsRes, settingsRes] = await Promise.all([
        fetch('/api/systems'),
        fetch('/api/leads'),
        fetch('/api/settings'),
      ]);

      const sysData = await sysRes.json();
      const leadsData = await leadsRes.json();
      const settingsData = await settingsRes.json();

      if (sysData.success) {
        setSystems(sysData.data);
      }

      if (leadsData.success) {
        setLeads(leadsData.data);
        if (leadsData.metrics) {
          setMetrics(leadsData.metrics);
        }
      }

      if (settingsData.success && settingsData.data?.currency) {
        setCurrency(settingsData.data.currency);
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

  const handleCurrencyChange = async (newCurr: CurrencyCode) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: newCurr }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrency(newCurr);
      }
    } catch (err) {
      console.error('Error updating currency:', err);
    }
  };

  const handleSaveSystem = async (data: Partial<SoftwareSystem>, editingId?: string) => {
    try {
      if (editingId) {
        // Update
        const res = await fetch(`/api/systems/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          fetchData();
        }
      } else {
        // Create
        const res = await fetch('/api/systems', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock_admin_token',
          },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          fetchData();
        }
      }
    } catch (err) {
      console.error('Error saving system:', err);
    }
  };

  const handleDeleteSystem = async (id: string) => {
    try {
      const res = await fetch(`/api/systems/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting system:', err);
    }
  };

  const handleUpdateLeadStatus = async (id: string, status: LeadInquiry['status']) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error updating lead status:', err);
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
      metrics={metrics}
      currency={currency}
      onCurrencyChange={handleCurrencyChange}
      onLogout={() => setAdminUser(null)}
      onRefreshData={fetchData}
      onSaveSystem={handleSaveSystem}
      onDeleteSystem={handleDeleteSystem}
      onUpdateLeadStatus={handleUpdateLeadStatus}
    />
  );
}
