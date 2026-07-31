'use client';

import { useState, useEffect } from 'react';

interface ConfigItem {
  key: string;
  value: any;
  type: string;
  category: string;
  description: string;
}

export default function SettingsPage() {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch for configuration items
    setTimeout(() => {
      setConfigs([
        { key: 'hallTicketReleaseDays', value: 7, type: 'number', category: 'Examination', description: 'Days before exam to release hall ticket' },
        { key: 'maxReEvaluationAttempts', value: 2, type: 'number', category: 'Examination', description: 'Max re-evaluation attempts per subject' },
        { key: 'passwordMinLength', value: 8, type: 'number', category: 'Authentication', description: 'Minimum length for passwords' }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleUpdate = (key: string, newValue: any) => {
    setConfigs(configs.map(c => c.key === key ? { ...c, value: newValue } : c));
    // In real app, call PATCH /api/v1/config/:key
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
        <p className="text-gray-500 mt-1">Manage global system settings dynamically.</p>
      </div>
      
      {loading ? (
        <div>Loading configurations...</div>
      ) : (
        <div className="space-y-8">
          {Array.from(new Set(configs.map(c => c.category))).map(category => (
            <div key={category} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">{category}</h2>
              </div>
              <div className="divide-y">
                {configs.filter(c => c.category === category).map(config => (
                  <div key={config.key} className="p-6 flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{config.description || config.key}</h3>
                      <p className="text-sm text-gray-500 font-mono mt-1">{config.key}</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type={config.type === 'number' ? 'number' : 'text'}
                        value={config.value}
                        onChange={(e) => handleUpdate(config.key, config.type === 'number' ? Number(e.target.value) : e.target.value)}
                        className="border rounded px-3 py-1.5 text-sm w-32 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
