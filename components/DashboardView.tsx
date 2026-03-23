
import React, { useState, useEffect } from 'react';
import { VitalsData, ActivityData, LocationData, PetProfile } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getHealthInsights } from '../services/geminiService';

interface DashboardViewProps {
  vitals: VitalsData;
  activity: ActivityData;
  location: LocationData;
  petProfile: PetProfile;
}

const DashboardView: React.FC<DashboardViewProps> = ({ vitals, activity, location, petProfile }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    setHistory(prev => {
      const newHistory = [...prev, { time: new Date().toLocaleTimeString().slice(0, 5), hr: Math.round(vitals.heartRate) }];
      return newHistory.slice(-10);
    });
  }, [vitals.heartRate]);

  const runHealthCheck = async () => {
    setLoadingAI(true);
    const result = await getHealthInsights(petProfile, vitals, activity);
    setAiInsight(result);
    setLoadingAI(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Vital Cards */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-red-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-red-500 mb-4 font-semibold">
              <i className="fa-solid fa-heart-pulse animate-pulse"></i>
              <span>Heart Rate</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-800">{Math.round(vitals.heartRate)}</span>
              <span className="text-slate-400 font-medium">BPM</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Normal Range: 70-150</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-blue-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-blue-500 mb-4 font-semibold">
              <i className="fa-solid fa-temperature-half"></i>
              <span>Temperature</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-800">{vitals.temperature.toFixed(1)}</span>
              <span className="text-slate-400 font-medium">°C</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Safe Range: 38.3-39.2</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-emerald-500 mb-4 font-semibold">
              <i className="fa-solid fa-person-running"></i>
              <span>Activity</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-800 capitalize">{activity.state}</span>
            </div>
            <div className="mt-3 flex gap-2 overflow-hidden">
               <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-emerald-500 transition-all`} style={{ width: activity.state === 'Running' ? '90%' : activity.state === 'Active' ? '60%' : '20%' }}></div>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-amber-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 text-amber-500 mb-4 font-semibold">
              <i className="fa-solid fa-location-crosshairs"></i>
              <span>Last Sync</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{vitals.lastUpdated}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Signal Strength: Excellent</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heart Rate Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Heart Rate Trend</h3>
            <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold">LIVE TELEMETRY</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="hr" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gemini AI Health Check */}
        <div className="bg-indigo-900 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <i className="fa-solid fa-brain text-8xl"></i>
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <i className="fa-solid fa-sparkles text-amber-400"></i>
              AI Health Insight
            </h3>
            <p className="text-indigo-100 text-sm mb-6">Analyze current telemetry with Gemini AI models for early warning detection.</p>
            
            {!aiInsight ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                  <i className={`fa-solid fa-microchip text-2xl ${loadingAI ? 'animate-spin' : ''}`}></i>
                </div>
                <button 
                  onClick={runHealthCheck}
                  disabled={loadingAI}
                  className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-colors disabled:opacity-50"
                >
                  {loadingAI ? 'Analyzing...' : 'Run Diagnostics'}
                </button>
              </div>
            ) : (
              <div className="flex-1 space-y-4 animate-in fade-in duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-400 flex items-center justify-center font-bold text-2xl">
                    {aiInsight.healthScore}%
                  </div>
                  <div>
                    <p className="font-bold text-lg">{aiInsight.status}</p>
                    <p className="text-xs text-indigo-200 uppercase tracking-wider">Health Score</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-indigo-100 italic">"{aiInsight.summary}"</p>
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-amber-400">AI Recommendations:</p>
                  {aiInsight.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <i className="fa-solid fa-check-circle text-emerald-400 mt-1"></i>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
                <button onClick={runHealthCheck} className="text-xs text-indigo-300 hover:text-white underline">Re-run analysis</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
