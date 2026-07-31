'use client';

import { useEffect, useState } from 'react';
import { Database, Server, Activity, HardDrive, Users, CheckCircle, Clock, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Widget {
  id: string;
  title: string;
  type: string;
  payload: any;
}

export default function DashboardPage() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        const response = await fetch(`${apiUrl}/dashboard/widgets`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch widgets');
        }
        
        const result = await response.json();
        
        // Map string iconNames to actual Lucide components
        const iconsMap: Record<string, any> = {
          Database, Server, Users, HardDrive, Clock, Activity
        };
        
        const mappedWidgets = result.data.map((widget: any) => {
          if (widget.payload.iconName) {
            widget.payload.icon = iconsMap[widget.payload.iconName] || Activity;
          }
          if (widget.payload.items) {
            widget.payload.items = widget.payload.items.map((item: any) => ({
              ...item,
              icon: iconsMap[item.iconName] || Activity
            }));
          }
          return widget;
        });

        setWidgets(mappedWidgets);
      } catch (error) {
        console.error('Error fetching dashboard widgets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWidgets();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back, Dr. Ajay Mallick. Here's what's happening today.</p>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-panel rounded-2xl h-40 animate-pulse bg-slate-100"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {widgets.map((widget, i) => {
            const Icon = widget.payload.icon || Activity;
            
            return (
              <div 
                key={widget.id} 
                className={`glass-panel rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-500/20 hover:border-blue-200 animate-fade-in-up stagger-${(i % 4) + 1}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={22} />
                  </div>
                  {widget.payload.change && (
                    <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                      widget.payload.change.direction === 'up' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {widget.payload.change.direction === 'up' ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
                      {widget.payload.change.value}
                    </div>
                  )}
                </div>
                
                <h2 className="text-sm font-bold text-slate-500 mb-1">{widget.title}</h2>
                
                {widget.type === 'status' && (
                  <div className="space-y-3 mt-4">
                    {widget.payload.items.map((item: any, idx: number) => {
                      const ItemIcon = item.icon || Activity;
                      return (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                            <ItemIcon size={14} className="text-slate-400" />
                            {item.label}
                          </div>
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold tracking-wider uppercase">
                            <CheckCircle size={10} />
                            {item.status}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                
                {widget.type === 'stat' && (
                  <div className="mt-2">
                    <div className="text-3xl font-bold text-slate-900 tracking-tight">
                      {widget.payload.value}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 font-bold">
                      {widget.payload.label}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          <div className="glass-panel rounded-2xl p-6 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 cursor-pointer animate-fade-in-up stagger-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Plus size={24} />
            </div>
            <p className="font-bold">Add Widget</p>
          </div>
        </div>
      )}
    </div>
  );
}
