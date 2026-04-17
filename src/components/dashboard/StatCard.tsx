import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  delay?: number;
}

export function StatCard({ label, value, icon: Icon, trend, className, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        "bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start justify-between",
        className
      )}
    >
      <div>
        <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">{label}</p>
        <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
        {trend && (
          <div className={cn(
            "mt-2 text-xs font-medium flex items-center gap-1",
            trend.isPositive ? "text-emerald-600" : "text-rose-600"
          )}>
            <span>{trend.isPositive ? '↑' : '↓'} {trend.value}%</span>
            <span className="text-gray-400 font-normal">vs last month</span>
          </div>
        )}
      </div>
      <div className="p-2 bg-gray-50 rounded-lg">
        <Icon className="w-5 h-5 text-gray-500" />
      </div>
    </motion.div>
  );
}
