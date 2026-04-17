import { Employee } from '../../types';
import { getManagerialInsights } from '../../services/geminiService';
import { useState, useEffect, useMemo } from 'react';
import { Sparkles, BrainCircuit, Target, Lightbulb, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

interface InsightsProps {
  employee: Employee | null;
}

export function InsightsPanel({ employee }: InsightsProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const radarData = useMemo(() => {
    if (!employee) return [];
    return [
      { subject: 'Technical', A: employee.skills.technical, fullMark: 100 },
      { subject: 'Comm.', A: employee.skills.communication, fullMark: 100 },
      { subject: 'Lead.', A: employee.skills.leadership, fullMark: 100 },
      { subject: 'Rel.', A: employee.skills.reliability, fullMark: 100 },
      { subject: 'Inno.', A: employee.skills.innovation, fullMark: 100 },
    ];
  }, [employee]);

  useEffect(() => {
    if (employee) {
      generate();
    }
  }, [employee?.id]);

  const generate = async () => {
    if (!employee) return;
    setLoading(true);
    setInsight(null);
    try {
      const result = await getManagerialInsights(employee);
      setInsight(result);
    } catch (err) {
      setInsight("Error generating insights.");
    } finally {
      setLoading(false);
    }
  };

  if (!employee) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
        <BrainCircuit className="w-12 h-12 text-gray-200 mb-4" />
        <h3 className="text-gray-900 font-medium">No Employee Selected</h3>
        <p className="text-sm text-gray-500 max-w-[200px]">Select an employee from the roster to generate AI insights.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
          <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">{employee.department} • {employee.tenureMonths}m Tenure</p>
        </div>
        <div className="p-2 bg-violet-50 rounded-xl">
          <Sparkles className="w-5 h-5 text-violet-500" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase text-emerald-700">Status</span>
          </div>
          <p className="text-sm font-semibold text-emerald-900 capitalize">{employee.predictedPerformance}</p>
        </div>
        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] font-bold uppercase text-blue-700">Risk Score</span>
          </div>
          <p className="text-sm font-semibold text-blue-900">
            {((1 - employee.predictionProbability!) * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
        <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 mb-2">Skill Fingerprint</h4>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Radar
                name="Employee"
                dataKey="A"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400">AI Recommendation</h4>
        <div className="min-h-[120px] bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10"
              >
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
                  <span className="text-[10px] font-mono uppercase text-gray-400">Analyzing...</span>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-600 leading-relaxed italic"
              >
                "{insight}"
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase text-gray-400 mb-1">Training Hours</p>
            <p className="text-lg font-semibold text-gray-900">{employee.trainingHours}h</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-gray-400 mb-1">Projects</p>
            <p className="text-lg font-semibold text-gray-900">{employee.projectsCompleted}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
