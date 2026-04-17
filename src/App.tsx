import { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Cpu,
  Target,
  TrendingUp,
  AlertCircle,
  Play,
  Info,
  SlidersHorizontal,
  RefreshCw,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateSyntheticData } from './services/employeeData';
import { trainAndPredict } from './services/predictionModel';
import { Employee, ModelMetrics, FeatureWeights } from './types';
import { StatCard } from './components/dashboard/StatCard';
import { DepartmentChart, PerformanceDistribution } from './components/dashboard/AnalyticsCharts';
import { EmployeeTable } from './components/employee/EmployeeTable';
import { InsightsPanel } from './components/employee/InsightsPanel';
import { ModelMetricsDisplay } from './components/model/ModelMetricsDisplay';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roster' | 'model'>('dashboard');
  const [weights, setWeights] = useState<FeatureWeights>({
    tenure: 15,
    lastReview: 35,
    training: 25,
    projects: 25
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const data = generateSyntheticData(40);
    return trainAndPredict(data).employees;
  });

  const [metrics, setMetrics] = useState<ModelMetrics>(() => trainAndPredict(employees).metrics);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isTraining, setIsTraining] = useState(false);

  // Recalculate predictions whenever weights change
  useEffect(() => {
    const { employees: updated, metrics: newMetrics } = trainAndPredict(employees, weights);
    setEmployees(updated);
    setMetrics(newMetrics);
  }, [weights]);

  const handleRetrain = () => {
    setIsTraining(true);
    setTimeout(() => {
      const newData = generateSyntheticData(40);
      const { employees: updated, metrics: newMetrics } = trainAndPredict(newData, weights);
      setEmployees(updated);
      setMetrics(newMetrics);
      setIsTraining(false);
    }, 1500);
  };

  const highPerformers = useMemo(() => employees.filter(e => e.predictedPerformance === 'High'), [employees]);
  const avgConfidence = useMemo(() => 
    employees.reduce((acc, e) => acc + (e.predictionProbability || 0), 0) / employees.length
  , [employees]);

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-violet-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col border-r border-slate-900">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-lg leading-tight text-white">InsightHR</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Predictor v2.0</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'roster', icon: Users, label: 'Employee Roster' },
              { id: 'model', icon: Target, label: 'Model Metrics' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200",
                  activeTab === item.id 
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" 
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-900">
          <div className="bg-slate-900 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">How it works</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              "We use classification models like Random Forest to predict performance based on historical HR signals."
            </p>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 text-center">
            Created by <span className="text-slate-300 font-medium">D Karthikeya</span>
          </p>
          <button className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors text-sm w-full px-4 mt-6">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-10 backdrop-blur-md bg-white/80">
          <div>
            <h2 className="text-xl font-semibold capitalize text-slate-800">{activeTab}</h2>
            <p className="text-xs text-slate-400">Manage and analyze your workforce performance indicators.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-slate-100 pr-6">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <button 
              onClick={handleRetrain}
              disabled={isTraining}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white rounded-xl text-sm font-medium hover:bg-slate-900 active:scale-95 transition-all disabled:opacity-50"
            >
              {isTraining ? (
                <Cpu className="w-4 h-4 animate-spin text-violet-400" />
              ) : (
                <Play className="w-4 h-4 text-violet-400" />
              )}
              {isTraining ? 'Training Model...' : 'Run Simulation'}
            </button>
          </div>
        </header>

        {/* Views */}
        <div className="p-10 flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard 
                    label="Total Workforce" 
                    value={employees.length} 
                    icon={Users} 
                    delay={0.1}
                  />
                  <StatCard 
                    label="High Performers" 
                    value={highPerformers.length} 
                    icon={TrendingUp} 
                    trend={{ value: 12, isPositive: true }}
                    delay={0.2}
                  />
                  <StatCard 
                    label="Avg Confidence" 
                    value={`${(avgConfidence * 100).toFixed(0)}%`} 
                    icon={Cpu} 
                    delay={0.3}
                  />
                  <StatCard 
                    label="Rec. Training" 
                    value={employees.filter(e => e.trainingHours < 15).length} 
                    icon={AlertCircle} 
                    delay={0.4}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-semibold text-slate-800">Departmental Distribution</h3>
                      <p className="text-xs text-slate-400 font-mono">Real-time Data Stream</p>
                    </div>
                    <DepartmentChart data={employees} />
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-semibold text-slate-800">Performance Split</h3>
                    </div>
                    <PerformanceDistribution data={employees} />
                    <div className="space-y-3 mt-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">High Performers</span>
                        <span className="font-semibold text-emerald-600">{highPerformers.length}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${(highPerformers.length / employees.length) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'roster' && (
              <motion.div 
                key="roster"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-220px)] overflow-hidden"
              >
                <div className="lg:col-span-2 overflow-y-auto pr-2 custom-scrollbar">
                  <EmployeeTable 
                    employees={employees} 
                    onSelect={setSelectedEmployee} 
                    selectedId={selectedEmployee?.id}
                  />
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-y-auto">
                  <InsightsPanel employee={selectedEmployee} />
                </div>
              </motion.div>
            )}

            {activeTab === 'model' && (
              <motion.div 
                key="model"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl"
              >
                <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm">
                  <div className="flex items-start justify-between mb-10">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Algorithm Tuning</h2>
                      <p className="text-slate-500 max-w-lg text-sm">
                        Adjust the relative importance of each feature in the calculation. Current model uses a non-linear interaction engine.
                      </p>
                    </div>
                    <SlidersHorizontal className="w-8 h-8 text-violet-200" />
                  </div>
                  
                  <div className="space-y-8">
                    {Object.entries(weights).map(([key, value]) => (
                      <div key={key} className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-mono uppercase tracking-widest text-slate-400 capitalize">{key}</label>
                          <span className="text-xs font-bold text-violet-600 font-mono">{value}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="1"
                          value={value}
                          onChange={(e) => setWeights(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600 hover:accent-violet-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-xs text-slate-500 leading-relaxed">
                    * Modifying weights forces a live recalculation of all employee performance probabilities ({employees.length} records).
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
                  <div className="flex items-start justify-between mb-10">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Model Evaluation</h3>
                      <p className="text-slate-500 text-sm">
                        Performance metrics based on current feature weights.
                      </p>
                    </div>
                    <Cpu className="w-8 h-8 text-emerald-200" />
                  </div>
                  <ModelMetricsDisplay metrics={metrics} />

                  <div className="mt-auto pt-10 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-100">
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Precision</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Measures the accuracy of positive predictions.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Recall</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Ability to find all true high performers.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Engine</h4>
                      <div className="flex items-center gap-2 text-violet-600">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span className="text-[10px] font-bold">LIVE RECALC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

