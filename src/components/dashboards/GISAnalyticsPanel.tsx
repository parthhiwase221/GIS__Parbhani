import { motion } from 'motion/react';
import {
  TrendingUp, TrendingDown, IndianRupee, Building2, Users, BarChart3,
  PieChart, AlertTriangle, CheckCircle2, Clock, XCircle, Target,
  Calculator, Percent, DollarSign, Home, ShoppingBag, Factory,
  Briefcase, TreePine, MapPin, Activity, Award
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import {
  BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart,
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

interface AnalyticsPanelProps {
  selectedWard: string[];
  propertyTypes: string[];
  taxStatus: string;
}

export function GISAnalyticsPanel({ selectedWard, propertyTypes, taxStatus }: AnalyticsPanelProps) {
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

  // Ward-wise collection data
  const wardCollectionData = [
    { ward: 'W1', collected: 85, pending: 15, target: 90, amount: 12.5 },
    { ward: 'W2', collected: 78, pending: 22, target: 90, amount: 15.2 },
    { ward: 'W3', collected: 82, pending: 18, target: 90, amount: 11.8 },
    { ward: 'W4', collected: 88, pending: 12, target: 90, amount: 18.4 },
    { ward: 'W5', collected: 76, pending: 24, target: 90, amount: 14.1 },
    { ward: 'W6', collected: 81, pending: 19, target: 90, amount: 13.6 }
  ];

  // Property type distribution
  const propertyTypeData = [
    { type: 'Residential', count: 28450, value: 62.8, color: '#3B82F6' },
    { type: 'Commercial', count: 12320, value: 27.2, color: '#8B5CF6' },
    { type: 'Industrial', count: 3240, value: 7.1, color: '#F59E0B' },
    { type: 'Institutional', count: 1850, value: 4.1, color: '#10B981' },
    { type: 'Vacant', count: 2140, value: 4.7, color: '#6B7280' }
  ];

  // Tax collection trend (last 6 months)
  const collectionTrendData = [
    { month: 'Jul', collected: 45.2, target: 50, defaulters: 1245 },
    { month: 'Aug', collected: 48.5, target: 50, defaulters: 1120 },
    { month: 'Sep', collected: 52.3, target: 50, defaulters: 985 },
    { month: 'Oct', collected: 49.8, target: 50, defaulters: 1050 },
    { month: 'Nov', collected: 55.6, target: 50, defaulters: 890 },
    { month: 'Dec', collected: 58.2, target: 50, defaulters: 756 }
  ];

  // Defaulter aging analysis
  const defaulterAgingData = [
    { category: '0-6 months', count: 2340, amount: 5.6 },
    { category: '6-12 months', count: 1820, amount: 8.2 },
    { category: '1-2 years', count: 1450, amount: 12.4 },
    { category: '2-3 years', count: 980, amount: 15.8 },
    { category: '3+ years', count: 1230, amount: 28.5 }
  ];

  // Property valuation by type
  const valuationData = [
    { type: 'Residential', avgValue: 45600, minValue: 12000, maxValue: 185000 },
    { type: 'Commercial', avgValue: 128400, minValue: 35000, maxValue: 580000 },
    { type: 'Industrial', avgValue: 245000, minValue: 85000, maxValue: 1250000 },
    { type: 'Institutional', avgValue: 95000, minValue: 28000, maxValue: 350000 }
  ];

  // Quick insights
  const insights = [
    {
      label: 'Top Performing Ward',
      value: 'Ward 4',
      metric: '88% Collection',
      icon: Award,
      color: theme.success,
      trend: '+5.2%'
    },
    {
      label: 'High-Value Properties',
      value: '2,845',
      metric: '> ₹1L tax/year',
      icon: IndianRupee,
      color: theme.primary,
      trend: '+12.4%'
    },
    {
      label: 'Avg Collection Time',
      value: '32 days',
      metric: 'From notice',
      icon: Clock,
      color: theme.warning,
      trend: '-8 days'
    },
    {
      label: 'Active Defaulters',
      value: '5,820',
      metric: '12.8% of total',
      icon: AlertTriangle,
      color: theme.danger,
      trend: '-245'
    }
  ];

  return (
    <div className="h-full overflow-y-auto" style={{ background: theme.background }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black" style={{ color: theme.textPrimary }}>
              Advanced Analytics Dashboard
            </h2>
            <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
              Comprehensive insights and trends analysis
            </p>
          </div>
          <Badge
            className="px-3 py-1"
            style={{
              background: `${theme.success}15`,
              color: theme.success,
              border: `1px solid ${theme.success}30`
            }}
          >
            <Activity className="w-3 h-3 mr-1" />
            Live Data
          </Badge>
        </div>

        {/* Quick Insights Grid */}
        <div className="grid grid-cols-2 gap-3">
          {insights.map((insight, idx) => (
            <motion.div
              key={insight.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-xl border"
              style={{
                background: 'white',
                borderColor: theme.border,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${insight.color}15` }}
                >
                  <insight.icon className="w-5 h-5" style={{ color: insight.color }} />
                </div>
                <Badge
                  className="text-xs px-2 py-0.5"
                  style={{
                    background: insight.trend.startsWith('+') || insight.trend.startsWith('-')
                      ? insight.trend.startsWith('+')
                        ? `${theme.success}15`
                        : `${theme.danger}15`
                      : `${theme.primary}15`,
                    color: insight.trend.startsWith('+')
                      ? theme.success
                      : insight.trend.startsWith('-')
                      ? theme.danger
                      : theme.primary,
                    border: 'none'
                  }}
                >
                  {insight.trend}
                </Badge>
              </div>
              <p className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                {insight.label}
              </p>
              <p className="text-xl font-black mb-0.5" style={{ color: theme.textPrimary }}>
                {insight.value}
              </p>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                {insight.metric}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Ward-wise Collection Performance */}
        <Card className="p-5" style={{ background: 'white', borderColor: theme.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black" style={{ color: theme.textPrimary }}>
              Ward-wise Collection Performance
            </h3>
            <Badge
              className="text-xs px-2 py-0.5"
              style={{ background: theme.background, color: theme.textSecondary, border: 'none' }}
            >
              6 Wards
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={wardCollectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
              <XAxis dataKey="ward" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="collected" fill={theme.success} name="Collected %" radius={[8, 8, 0, 0]} />
              <Bar dataKey="pending" fill={theme.danger} name="Pending %" radius={[8, 8, 0, 0]} />
              <Bar dataKey="target" fill={theme.primary} name="Target %" radius={[8, 8, 0, 0]} opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-4">
          {/* Property Type Distribution */}
          <Card className="p-5" style={{ background: 'white', borderColor: theme.border }}>
            <h3 className="text-sm font-black mb-4" style={{ color: theme.textPrimary }}>
              Property Type Distribution
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <RechartsPieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, value }) => `${type}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {propertyTypeData.map((item) => (
                <div key={item.type} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ background: item.color }}
                    />
                    <span style={{ color: theme.textSecondary }}>{item.type}</span>
                  </div>
                  <span style={{ color: theme.textPrimary }}>{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Property Valuation */}
          <Card className="p-5" style={{ background: 'white', borderColor: theme.border }}>
            <h3 className="text-sm font-black mb-4" style={{ color: theme.textPrimary }}>
              Average Tax by Property Type
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={valuationData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => `₹${(value / 1000).toFixed(1)}K`}
                />
                <Bar dataKey="avgValue" fill={theme.primary} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {valuationData.map((item) => (
                <div key={item.type} className="flex items-center justify-between text-xs">
                  <span style={{ color: theme.textSecondary }}>{item.type}</span>
                  <span style={{ color: theme.textPrimary }}>
                    ₹{(item.minValue / 1000).toFixed(0)}K - ₹{(item.maxValue / 1000).toFixed(0)}K
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Collection Trend */}
        <Card className="p-5" style={{ background: 'white', borderColor: theme.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black" style={{ color: theme.textPrimary }}>
              6-Month Collection Trend
            </h3>
            <div className="flex items-center gap-2">
              <Badge
                className="text-xs px-2 py-0.5"
                style={{
                  background: `${theme.success}15`,
                  color: theme.success,
                  border: 'none'
                }}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                +18.5%
              </Badge>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={collectionTrendData}>
              <defs>
                <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.success} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={theme.success} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={theme.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area
                type="monotone"
                dataKey="collected"
                stroke={theme.success}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCollected)"
                name="Collected (₹Cr)"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke={theme.primary}
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorTarget)"
                name="Target (₹Cr)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Defaulter Aging Analysis */}
        <Card className="p-5" style={{ background: 'white', borderColor: theme.border }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black" style={{ color: theme.textPrimary }}>
              Defaulter Aging Analysis
            </h3>
            <Badge
              className="text-xs px-2 py-0.5"
              style={{
                background: `${theme.danger}15`,
                color: theme.danger,
                border: 'none'
              }}
            >
              7,820 Total
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={defaulterAgingData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar yAxisId="left" dataKey="count" fill={theme.warning} name="No. of Defaulters" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="amount" fill={theme.danger} name="Amount (₹Cr)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Statistical Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Collection Efficiency', value: '78.4%', change: '+2.1%', icon: Target },
            { label: 'Avg Tax/Property', value: '₹52,340', change: '+8.5%', icon: Calculator },
            { label: 'Recovery Rate', value: '65.2%', change: '+4.3%', icon: Percent },
            { label: 'New Assessments', value: '1,247', change: '+15.2%', icon: Building2 },
            { label: 'Online Payments', value: '82.5%', change: '+12.8%', icon: DollarSign },
            { label: 'Complaint Resolution', value: '76.8%', change: '+5.4%', icon: CheckCircle2 }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-lg border"
              style={{
                background: 'white',
                borderColor: theme.border
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: theme.background }}
                >
                  <stat.icon className="w-4 h-4" style={{ color: theme.primary }} />
                </div>
                <Badge
                  className="text-xs px-1.5 py-0"
                  style={{
                    background: stat.change.startsWith('+') ? `${theme.success}15` : `${theme.danger}15`,
                    color: stat.change.startsWith('+') ? theme.success : theme.danger,
                    border: 'none'
                  }}
                >
                  {stat.change}
                </Badge>
              </div>
              <p className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                {stat.label}
              </p>
              <p className="text-base font-black" style={{ color: theme.textPrimary }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
