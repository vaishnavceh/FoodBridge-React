import React from 'react';
import {
  Sparkles,
  FileText,
  Utensils,
  Truck,
  Handshake,
  BarChart3,
  Globe2,
  Milestone,
  Cpu,
  Layers,
  Database,
  Server
} from 'lucide-react';
import Card from '../components/ui/Card';

export const LearnMore = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-20">
      {/* Hero Manifesto */}
      <section className="text-center py-16 px-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-transparent to-transparent border border-white/5 relative overflow-hidden">
        <span className="text-amber-400 text-xs font-black tracking-widest uppercase mb-4 inline-block">
          PLATFORM MANIFESTO
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Zero Waste. Zero Hunger.
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          A high-performance logistics ecosystem transforming food surplus into tangible social and environmental impact.
        </p>
      </section>

      {/* Executive Summary */}
      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-400" /> Executive Summary
        </h2>
        <Card className="p-8 border-white/10 text-slate-300 leading-relaxed text-base">
          <p>
            FoodBridge addresses the catastrophic mismatch between municipal food surplus and widespread food insecurity. By providing instant geolocation tracking, verifiable digital donation receipts, and a tripartite coordination model, the platform eliminates the friction that traditionally results in edible food being discarded into landfills.
          </p>
        </Card>
      </section>

      {/* Triad Model */}
      <section className="space-y-6" id="triad">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-amber-400" /> The Triad Model
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-sky-500/20" id="donors">
            <Utensils className="w-8 h-8 text-sky-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Donors</h3>
            <p className="text-sm text-slate-400">
              Upload surplus food in seconds with expiry timestamps, GPS pickup pins, and digital certificates.
            </p>
          </Card>

          <Card className="p-6 border-emerald-500/20" id="ngos">
            <Handshake className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">NGOs</h3>
            <p className="text-sm text-slate-400">
              Reserve active donations or broadcast urgent supply signals directly to the donor network.
            </p>
          </Card>

          <Card className="p-6 border-amber-500/20" id="volunteers">
            <Truck className="w-8 h-8 text-amber-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Volunteers</h3>
            <p className="text-sm text-slate-400">
              Accept dispatch runs, execute turn-by-turn routing, and bridge the final mile of redistribution.
            </p>
          </Card>
        </div>
      </section>

      {/* Impact Analytics */}
      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-amber-400" /> Platform Benchmark Impact
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center border-white/5 bg-slate-900/40">
            <h3 className="text-4xl font-black text-amber-400 mb-1">10K+</h3>
            <p className="text-xs font-semibold text-slate-400 uppercase">Meals Delivered</p>
          </Card>
          <Card className="p-6 text-center border-white/5 bg-slate-900/40">
            <h3 className="text-4xl font-black text-amber-400 mb-1">500+</h3>
            <p className="text-xs font-semibold text-slate-400 uppercase">Volunteers</p>
          </Card>
          <Card className="p-6 text-center border-white/5 bg-slate-900/40">
            <h3 className="text-4xl font-black text-amber-400 mb-1">300+</h3>
            <p className="text-xs font-semibold text-slate-400 uppercase">Registered Donors</p>
          </Card>
          <Card className="p-6 text-center border-white/5 bg-slate-900/40">
            <h3 className="text-4xl font-black text-amber-400 mb-1">150+</h3>
            <p className="text-xs font-semibold text-slate-400 uppercase">Partner NGOs</p>
          </Card>
        </div>
      </section>

      {/* UN Sustainable Development Goals */}
      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Globe2 className="w-6 h-6 text-amber-400" /> UN Sustainable Development Goals
        </h2>
        <Card className="p-8 space-y-6 border-white/10">
          <div>
            <div className="flex justify-between text-sm font-bold text-white mb-2">
              <span>SDG 2: Zero Hunger</span>
              <span className="text-amber-400">85% Alignment</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="w-[85%] h-full bg-amber-400 rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-bold text-white mb-2">
              <span>SDG 12: Responsible Consumption and Production</span>
              <span className="text-amber-400">78% Alignment</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="w-[78%] h-full bg-amber-400 rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-bold text-white mb-2">
              <span>SDG 13: Climate Action (Methane Abatement)</span>
              <span className="text-amber-400">65% Alignment</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="w-[65%] h-full bg-amber-400 rounded-full" />
            </div>
          </div>
        </Card>
      </section>

      {/* System Architecture */}
      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-amber-400" /> Production Architecture
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center border-white/5">
            <Cpu className="w-8 h-8 text-sky-400 mx-auto mb-2" />
            <h4 className="font-bold text-white text-sm">React + Vite</h4>
            <p className="text-[11px] text-slate-500 mt-1">SPA Frontend</p>
          </Card>
          <Card className="p-6 text-center border-white/5">
            <Server className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h4 className="font-bold text-white text-sm">Node + Express</h4>
            <p className="text-[11px] text-slate-500 mt-1">RESTful API Engine</p>
          </Card>
          <Card className="p-6 text-center border-white/5">
            <Layers className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h4 className="font-bold text-white text-sm">Prisma ORM</h4>
            <p className="text-[11px] text-slate-500 mt-1">Type-Safe DB Layer</p>
          </Card>
          <Card className="p-6 text-center border-white/5">
            <Database className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h4 className="font-bold text-white text-sm">MySQL Database</h4>
            <p className="text-[11px] text-slate-500 mt-1">ACID Relational Data</p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LearnMore;
