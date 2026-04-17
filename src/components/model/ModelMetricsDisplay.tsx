import { ModelMetrics } from '../../types';

interface MatrixProps {
  metrics: ModelMetrics;
}

export function ModelMetricsDisplay({ metrics }: MatrixProps) {
  const { tp, fp, tn, fn } = metrics.confusionMatrix;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Accuracy', value: metrics.accuracy, color: 'text-blue-600' },
          { label: 'Precision', value: metrics.precision, color: 'text-indigo-600' },
          { label: 'Recall', value: metrics.recall, color: 'text-emerald-600' },
          { label: 'F1 Score', value: metrics.f1Score, color: 'text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-xl font-bold font-mono ${stat.color}`}>
              {(stat.value * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-2xl p-6 text-white overflow-hidden relative">
        <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500 mb-6">Confusion Matrix</h4>
        
        <div className="grid grid-cols-2 gap-px bg-gray-800 rounded-lg overflow-hidden border border-gray-800">
          <div className="bg-gray-900 p-4 flex flex-col items-center justify-center">
            <p className="text-[10px] text-gray-500 mb-1">True Positive</p>
            <p className="text-2xl font-mono text-emerald-400">{tp}</p>
          </div>
          <div className="bg-gray-900 p-4 flex flex-col items-center justify-center">
            <p className="text-[10px] text-gray-500 mb-1">False Positive</p>
            <p className="text-2xl font-mono text-rose-400">{fp}</p>
          </div>
          <div className="bg-gray-900 p-4 flex flex-col items-center justify-center">
            <p className="text-[10px] text-gray-500 mb-1">False Negative</p>
            <p className="text-2xl font-mono text-rose-400">{fn}</p>
          </div>
          <div className="bg-gray-900 p-4 flex flex-col items-center justify-center">
            <p className="text-[10px] text-gray-500 mb-1">True Negative</p>
            <p className="text-2xl font-mono text-emerald-400">{tn}</p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between text-[10px] font-mono text-gray-600 uppercase">
          <span>Predicted Class</span>
          <span>Actual Class</span>
        </div>
      </div>
    </div>
  );
}
