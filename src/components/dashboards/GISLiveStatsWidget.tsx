import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity, TrendingUp, TrendingDown, IndianRupee, Users,
  MapPin, Bell, CheckCircle2, Clock, AlertTriangle, Zap
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export function GISLiveStatsWidget() {
  const theme = {
    primary: '#1D4ED8',
    success: '#16A34A',
    warning: '#F59E0B',
    danger: '#DC2626',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    background: '#F3F4F6',
  };

  // Simulate live updates
  const [liveStats, setLiveStats] = useState({
    activeUsers: 12,
    recentPayments: 45,
    newAssessments: 8,
    pendingApprovals: 23
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'payment',
      message: 'Tax payment received - WD4-2156',
      time: '2 mins ago',
      icon: IndianRupee,
      color: theme.success
    },
    {
      id: 2,
      type: 'assessment',
      message: 'New property assessed - WD2-3421',
      time: '5 mins ago',
      icon: CheckCircle2,
      color: theme.primary
    },
    {
      id: 3,
      type: 'alert',
      message: 'Overdue notice sent - WD1-1234',
      time: '12 mins ago',
      icon: Bell,
      color: theme.warning
    },
    {
      id: 4,
      type: 'update',
      message: 'GIS tag updated - WD6-5678',
      time: '18 mins ago',
      icon: MapPin,
      color: theme.primary
    }
  ]);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update stats
      setLiveStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        recentPayments: prev.recentPayments + Math.floor(Math.random() * 5),
        newAssessments: prev.newAssessments + Math.floor(Math.random() * 2),
        pendingApprovals: prev.pendingApprovals - Math.floor(Math.random() * 2)
      }));

      // Occasionally add new activity
      if (Math.random() > 0.7) {
        const newActivities = [
          {
            type: 'payment',
            message: `Tax payment received - WD${Math.floor(Math.random() * 6) + 1}-${Math.floor(Math.random() * 9000) + 1000}`,
            icon: IndianRupee,
            color: theme.success
          },
          {
            type: 'assessment',
            message: `Property assessed - WD${Math.floor(Math.random() * 6) + 1}-${Math.floor(Math.random() * 9000) + 1000}`,
            icon: CheckCircle2,
            color: theme.primary
          },
          {
            type: 'alert',
            message: `Notice sent - WD${Math.floor(Math.random() * 6) + 1}-${Math.floor(Math.random() * 9000) + 1000}`,
            icon: Bell,
            color: theme.warning
          }
        ];

        const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
        setRecentActivities(prev => [
          {
            id: Date.now(),
            ...randomActivity,
            time: 'Just now'
          },
          ...prev.slice(0, 4)
        ]);
      }
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: 'Active Users',
      value: liveStats.activeUsers,
      icon: Users,
      color: theme.primary,
      trend: '+2'
    },
    {
      label: 'Today\'s Payments',
      value: liveStats.recentPayments,
      icon: IndianRupee,
      color: theme.success,
      trend: '+12'
    },
    {
      label: 'New Assessments',
      value: liveStats.newAssessments,
      icon: CheckCircle2,
      color: theme.primary,
      trend: '+3'
    },
    {
      label: 'Pending',
      value: liveStats.pendingApprovals,
      icon: Clock,
      color: theme.warning,
      trend: '-5'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 left-6 z-30 w-80"
    >
      
    </motion.div>
  );
}
