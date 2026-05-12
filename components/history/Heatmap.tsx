'use client';

import React from 'react';

interface HeatmapProps {
  data: Record<string, boolean>; // date -> completed
}

export function Heatmap({ data }: HeatmapProps) {
  // Generate last 12 weeks of dates
  const weeks = 12;
  const daysInWeek = 7;
  const totalDays = weeks * daysInWeek;
  
  const today = new Date();
  const historyDates = Array.from({ length: totalDays }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (totalDays - 1 - i));
    return d.toISOString().split('T')[0];
  });

  // Group into weeks
  const weeksData = [];
  for (let i = 0; i < weeks; i++) {
    weeksData.push(historyDates.slice(i * 7, (i + 1) * 7));
  }

  return (
    <div className="bg-white p-8 rounded-[32px] border border-border-warm shadow-sm overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {weeksData.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-2">
            {week.map((date) => {
              const isCompleted = data[date];
              const isToday = date === today.toISOString().split('T')[0];
              
              return (
                <div
                  key={date}
                  title={date}
                  className={`w-4 h-4 rounded-sm transition-all duration-500 ${
                    isCompleted 
                      ? 'bg-teal-dust' 
                      : isToday 
                        ? 'border-2 border-teal-dust/30 bg-white' 
                        : 'bg-charcoal/5'
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex items-center justify-between text-[10px] text-charcoal/30 uppercase font-bold tracking-widest">
        <span>12 Weeks Ago</span>
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="w-3 h-3 bg-charcoal/5 rounded-sm" />
          <div className="w-3 h-3 bg-teal-dust/40 rounded-sm" />
          <div className="w-3 h-3 bg-teal-dust rounded-sm" />
          <span>More</span>
        </div>
        <span>Today</span>
      </div>
    </div>
  );
}
