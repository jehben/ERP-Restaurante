import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function DateRangeFilter({ startDate, endDate, onStartDateChange, onEndDateChange }: DateRangeFilterProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 border border-black/5 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-brand-orange/50 transition-shadow">
      <Calendar className="w-4 h-4 text-brand-light shrink-0" />
      <input 
        type="date" 
        value={startDate} 
        onChange={(e) => onStartDateChange(e.target.value)}
        className="bg-transparent text-sm text-brand-dark focus:outline-none w-[110px]"
      />
      <span className="text-brand-light text-sm">até</span>
      <input 
        type="date" 
        value={endDate} 
        onChange={(e) => onEndDateChange(e.target.value)}
        className="bg-transparent text-sm text-brand-dark focus:outline-none w-[110px]"
      />
    </div>
  );
}
