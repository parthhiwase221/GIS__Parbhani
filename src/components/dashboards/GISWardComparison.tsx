import { motion, AnimatePresence } from 'motion/react';
import {
  X, MapPin, TrendingUp, TrendingDown, Building2, IndianRupee,
  Users, Target, AlertTriangle, CheckCircle2, BarChart3, Award
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import {
  BarChart, Bar, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

interface WardComparisonProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GISWardComparison({ isOpen, onClose }: WardComparisonProps) {
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

  const wardColors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4'];

  // Comprehensive ward data
  const wardData = [
    {
      id: 'ward1',
      name: 'Naupada',
      properties: 2840,
      collected: 85,
      target: 90,
      avgTax: 48500,
      defaulters: 425,
      complaints: 34,
      newAssessments: 156,
      color: wardColors[0]
    },
    {
      id: 'ward2',
      name: 'Kopri',
      properties: 3120,
      collected: 78,
      target: 90,
      avgTax: 52300,
      defaulters: 686,
      complaints: 52,
      newAssessments: 189,
      color: wardColors[1]
    },
    {
      id: 'ward3',
      name: 'Vartak Nagar',
      properties: 2650,
      collected: 82,
      target: 90,
      avgTax: 51200,
      defaulters: 477,
      complaints: 28,
      newAssessments: 134,
      color: wardColors[2]
    },
    {
      id: 'ward4',
      name: 'Wagle Estate',
      properties: 4230,
      collected: 88,
      target: 90,
      avgTax: 65400,
      defaulters: 507,
      complaints: 45,
      newAssessments: 298,
      color: wardColors[3]
    },
    {
      id: 'ward5',
      name: 'Ghodbunder',
      properties: 3890,
      collected: 76,
      target: 90,
      avgTax: 49800,
      defaulters: 933,
      complaints: 67,
      newAssessments: 245,
      color: wardColors[4]
    },
    {
      id: 'ward6',
      name: 'Majiwada',
      properties: 2940,
      collected: 81,
      target: 90,
      avgTax: 54100,
      defaulters: 558,
      complaints: 41,
      newAssessments: 178,
      color: wardColors[5]
    }
  ];

  // Radar chart data for performance metrics
  const performanceData = wardData.map(ward => ({
    ward: ward.name,
    collection: ward.collected,
    efficiency: ((ward.properties - ward.defaulters) / ward.properties) * 100,
    satisfaction: 100 - (ward.complaints / ward.properties) * 100,
    growth: (ward.newAssessments / ward.properties) * 100 * 10
  }));

  // Collection trend comparison
  const trendData = [
    {
      month: 'Jul',
      ward1: 82, ward2: 75, ward3: 79, ward4: 85, ward5: 73, ward6: 78
    },
    {
      month: 'Aug',
      ward1: 83, ward2: 76, ward3: 80, ward4: 86, ward5: 74, ward6: 79
    },
    {
      month: 'Sep',
      ward1: 84, ward2: 77, ward3: 81, ward4: 87, ward5: 75, ward6: 80
    },
    {
      month: 'Oct',
      ward1: 84, ward2: 77, ward3: 81, ward4: 87, ward5: 75, ward6: 80
    },
    {
      month: 'Nov',
      ward1: 85, ward2: 78, ward3: 82, ward4: 88, ward5: 76, ward6: 81
    },
    {
      month: 'Dec',
      ward1: 85, ward2: 78, ward3: 82, ward4: 88, ward5: 76, ward6: 81
    }
  ];

  // Sort wards by performance
  const topPerformers = [...wardData].sort((a, b) => b.collected - a.collected).slice(0, 3);
  const needsAttention = [...wardData].sort((a, b) => a.collected - b.collected).slice(0, 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Comparison Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl max-h-[90vh] overflow-y-auto z-50"
          >
            <Card
              className="p-6"
              style={{
                background: 'white',
                borderColor: theme.border,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)'
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black flex items-center gap-2" style={{ color: theme.textPrimary }}>
                    <BarChart3 className="w-6 h-6" style={{ color: theme.primary }} />
                    Ward-wise Comparison Dashboard
                  </h2>
                  <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                    Comprehensive performance analysis across all 6 wards
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Top Performers & Needs Attention */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Top Performers */}
                <Card className="p-4" style={{ background: `${theme.success}05`, borderColor: `${theme.success}30` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5" style={{ color: theme.success }} />
                    <h3 className="text-sm font-black" style={{ color: theme.textPrimary }}>
                      Top Performers
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {topPerformers.map((ward, idx) => (
                      <div
                        key={ward.id}
                        className="flex items-center justify-between p-2 rounded-lg"
                        style={{ background: 'white' }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center text-xs font-black text-white"
                            style={{ background: ward.color }}
                          >
                            {idx + 1}
                          </div>
                          <span className="text-sm font-black" style={{ color: theme.textPrimary }}>
                            {ward.name}
                          </span>
                        </div>
                        <Badge
                          className="text-xs px-2 py-0.5"
                          style={{
                            background: `${theme.success}15`,
                            color: theme.success,
                            border: 'none'
                          }}
                        >
                          {ward.collected}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Needs Attention */}
                <Card className="p-4" style={{ background: `${theme.warning}05`, borderColor: `${theme.warning}30` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5" style={{ color: theme.warning }} />
                    <h3 className="text-sm font-black" style={{ color: theme.textPrimary }}>
                      Needs Attention
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {needsAttention.map((ward) => (
                      <div
                        key={ward.id}
                        className="flex items-center justify-between p-2 rounded-lg"
                        style={{ background: 'white' }}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" style={{ color: ward.color }} />
                          <span className="text-sm font-black" style={{ color: theme.textPrimary }}>
                            {ward.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className="text-xs px-2 py-0.5"
                            style={{
                              background: `${theme.danger}15`,
                              color: theme.danger,
                              border: 'none'
                            }}
                          >
                            {ward.defaulters} defaulters
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Detailed Metrics Table */}
              <Card className="p-4 mb-6" style={{ background: theme.background, borderColor: theme.border }}>
                <h3 className="text-sm font-black mb-3" style={{ color: theme.textPrimary }}>
                  Detailed Ward Metrics
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${theme.border}` }}>
                        <th className="text-left p-2 font-black" style={{ color: theme.textSecondary }}>Ward</th>
                        <th className="text-right p-2 font-black" style={{ color: theme.textSecondary }}>Properties</th>
                        <th className="text-right p-2 font-black" style={{ color: theme.textSecondary }}>Collection %</th>
                        <th className="text-right p-2 font-black" style={{ color: theme.textSecondary }}>Avg Tax</th>
                        <th className="text-right p-2 font-black" style={{ color: theme.textSecondary }}>Defaulters</th>
                        <th className="text-right p-2 font-black" style={{ color: theme.textSecondary }}>Complaints</th>
                        <th className="text-right p-2 font-black" style={{ color: theme.textSecondary }}>New Assess.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wardData.map((ward) => (
                        <tr
                          key={ward.id}
                          className="border-b"
                          style={{ borderColor: theme.border }}
                        >
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded"
                                style={{ background: ward.color }}
                              />
                              <span className="font-black" style={{ color: theme.textPrimary }}>
                                {ward.name}
                              </span>
                            </div>
                          </td>
                          <td className="text-right p-2" style={{ color: theme.textPrimary }}>
                            {ward.properties.toLocaleString()}
                          </td>
                          <td className="text-right p-2">
                            <Badge
                              className="text-xs px-2 py-0.5"
                              style={{
                                background: ward.collected >= 85
                                  ? `${theme.success}15`
                                  : ward.collected >= 80
                                  ? `${theme.warning}15`
                                  : `${theme.danger}15`,
                                color: ward.collected >= 85
                                  ? theme.success
                                  : ward.collected >= 80
                                  ? theme.warning
                                  : theme.danger,
                                border: 'none'
                              }}
                            >
                              {ward.collected}%
                            </Badge>
                          </td>
                          <td className="text-right p-2" style={{ color: theme.textPrimary }}>
                            ₹{(ward.avgTax / 1000).toFixed(1)}K
                          </td>
                          <td className="text-right p-2" style={{ color: theme.danger }}>
                            {ward.defaulters}
                          </td>
                          <td className="text-right p-2" style={{ color: theme.warning }}>
                            {ward.complaints}
                          </td>
                          <td className="text-right p-2" style={{ color: theme.success }}>
                            +{ward.newAssessments}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Charts Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Collection Trend */}
                <Card className="p-4" style={{ background: 'white', borderColor: theme.border }}>
                  <h3 className="text-sm font-black mb-3" style={{ color: theme.textPrimary }}>
                    6-Month Collection Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          background: 'white',
                          border: `1px solid ${theme.border}`,
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      {wardData.map((ward, idx) => (
                        <Line
                          key={ward.id}
                          type="monotone"
                          dataKey={ward.id}
                          stroke={ward.color}
                          strokeWidth={2}
                          name={ward.name}
                          dot={{ r: 3 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Performance Radar */}
                <Card className="p-4" style={{ background: 'white', borderColor: theme.border }}>
                  <h3 className="text-sm font-black mb-3" style={{ color: theme.textPrimary }}>
                    Multi-dimensional Performance
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={performanceData}>
                      <PolarGrid stroke={theme.border} />
                      <PolarAngleAxis dataKey="ward" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          background: 'white',
                          border: `1px solid ${theme.border}`,
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Radar
                        name="Collection"
                        dataKey="collection"
                        stroke={theme.primary}
                        fill={theme.primary}
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Efficiency"
                        dataKey="efficiency"
                        stroke={theme.success}
                        fill={theme.success}
                        fillOpacity={0.3}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
