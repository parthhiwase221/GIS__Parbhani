import React, { useState, useEffect, memo } from 'react';
import { TrendingUp, LucideIcon } from 'lucide-react';
import { Card } from '../../ui/card';

// Custom hook for counting animation - extracted for reusability
function useCountUp(end: number, duration: number = 2000, decimals: number = 1) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation (easeOutQuart)
      const easeOut = 1 - Math.pow(1 - progress, 4);
      
      setCount(easeOut * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return count;
}

// Animated KPI Card Component - Memoized
interface AnimatedKPICardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  subtitle: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  delay?: number;
}

export const AnimatedKPICard = memo(function AnimatedKPICard({ 
  title, 
  value, 
  suffix = '', 
  prefix = '₹',
  decimals = 1,
  subtitle,
  icon: Icon,
  gradientFrom,
  gradientTo,
  delay = 0
}: AnimatedKPICardProps) {
  const [startCounting, setStartCounting] = useState(false);
  const animatedValue = useCountUp(startCounting ? value : 0, 2000, decimals);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartCounting(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (\n    <Card className={`p-6 bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white border-0 shadow-lg transform transition-all duration-500 hover:scale-105`}>
      <div className=\"flex items-start justify-between\">
        <div>
          <p className=\"text-white/80 text-sm\">{title}</p>
          <h3 className=\"text-3xl font-bold mt-2\">
            {prefix}{animatedValue.toFixed(decimals)}{suffix}
          </h3>
          <div className=\"flex items-center gap-1 mt-2 text-white/80\">
            <TrendingUp className=\"w-4 h-4\" />
            <span className=\"text-sm\">{subtitle}</span>
          </div>
        </div>
        <div className=\"bg-white/20 p-3 rounded-lg\">
          <Icon className=\"w-6 h-6\" />
        </div>
      </div>
    </Card>
  );
});
