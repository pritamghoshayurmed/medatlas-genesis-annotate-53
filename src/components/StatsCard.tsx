
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'down' | 'neutral';
}

const StatsCard = ({ title, value, change, icon: Icon, trend }: StatsCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return null;
    }
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            <div className="flex items-center space-x-1 mt-2">
              {TrendIcon && <TrendIcon className={`w-3 h-3 ${getTrendColor()}`} />}
              <p className={`text-xs ${getTrendColor()}`}>{change}</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-teal-400/20 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
