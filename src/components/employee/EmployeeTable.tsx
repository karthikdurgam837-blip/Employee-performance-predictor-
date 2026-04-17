import { Employee } from '../../types';
import { cn } from '../../lib/utils';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface TableProps {
  employees: Employee[];
  onSelect: (emp: Employee) => void;
  selectedId?: string;
}

export function EmployeeTable({ employees, onSelect, selectedId }: TableProps) {
  const [search, setSearch] = useState('');

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search employees or departments..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-bottom border-gray-100">
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-wider text-gray-400">Employee</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-wider text-gray-400">Department</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-wider text-gray-400">Prediction</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-wider text-gray-400">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((emp) => (
                <tr 
                  key={emp.id}
                  onClick={() => onSelect(emp)}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-violet-50/30",
                    selectedId === emp.id ? "bg-violet-50/50" : ""
                  )}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono uppercase">{emp.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-[10px] font-medium rounded-full bg-gray-100 text-gray-600">
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-semibold",
                      emp.predictedPerformance === 'High' ? "text-emerald-600" : "text-rose-600"
                    )}>
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        emp.predictedPerformance === 'High' ? "bg-emerald-500" : "bg-rose-500"
                      )} />
                      {emp.predictedPerformance}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-[60px]">
                        <div 
                          className="h-full bg-violet-500 rounded-full" 
                          style={{ width: `${(emp.predictionProbability || 0) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">
                        {((emp.predictionProbability || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
