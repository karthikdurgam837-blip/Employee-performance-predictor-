import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Employee } from '../../types';

interface ChartsProps {
  data: Employee[];
}

const COLORS = ['#8b5cf6', '#ec4899', '#f97316', '#10b981', '#3b82f6'];

export function DepartmentChart({ data }: ChartsProps) {
  const deptData = data.reduce((acc: any[], emp) => {
    const existing = acc.find(d => d.name === emp.department);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: emp.department, count: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            dy={10}
          />
          <YAxis 
             axisLine={false} 
             tickLine={false} 
             tick={{ fontSize: 12, fill: '#94a3b8' }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            cursor={{ fill: '#f8fafc' }}
          />
          <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PerformanceDistribution({ data }: ChartsProps) {
  const highCount = data.filter(e => e.predictedPerformance === 'High').length;
  const lowCount = data.length - highCount;
  
  const pieData = [
    { name: 'High Performer', value: highCount },
    { name: 'Low Performer', value: lowCount },
  ];

  const COLORS = ['#10b981', '#f43f5e'];

  return (
    <div className="h-[300px] w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
