import { motion, AnimatePresence } from 'motion/react';
import {
  X, Flame, MapPin, DollarSign, AlertTriangle, Users,
  CheckCircle2, Target, Activity
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';

interface HeatMapConfigProps {
  isOpen: boolean;
  onClose: () => void;
  heatMapType: string;
  onHeatMapTypeChange: (type: string) => void;
  intensity: number;
  onIntensityChange: (value: number) => void;
}

export function GISHeatMapConfig({
  isOpen,
  onClose,
  heatMapType,
  onHeatMapTypeChange,
  intensity,
  onIntensityChange
}: HeatMapConfigProps) {
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

  const heatMapTypes = [
    {
      id: 'none',
      label: 'No Heat Map',
      description: 'Standard map view',
      icon: MapPin,
      color: theme.textSecondary
    },
    {
      id: 'collection',
      label: 'Tax Collection',
      description: 'Shows collection rate density',
      icon: DollarSign,
      color: theme.success,
      gradient: ['#10B981', '#FBBF24', '#EF4444']
    },
    {
      id: 'defaulters',
      label: 'Defaulter Density',
      description: 'Highlights defaulter hotspots',
      icon: AlertTriangle,
      color: theme.danger,
      gradient: ['#FBBF24', '#F97316', '#DC2626']
    },
    {
      id: 'complaints',
      label: 'Complaint Hotspots',
      description: 'Areas with high complaint rates',
      icon: Activity,
      color: theme.warning,
      gradient: ['#60A5FA', '#FBBF24', '#EF4444']
    },
    {
      id: 'density',
      label: 'Property Density',
      description: 'Property concentration map',
      icon: Users,
      color: theme.primary,
      gradient: ['#93C5FD', '#3B82F6', '#1D4ED8']
    },
    {
      id: 'assessment',
      label: 'Assessment Value',
      description: 'Property value distribution',
      icon: Target,
      color: '#8B5CF6',
      gradient: ['#C4B5FD', '#8B5CF6', '#6D28D9']
    }
  ];

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

          {/* Config Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50"
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
                  <h2 className="text-lg font-black flex items-center gap-2" style={{ color: theme.textPrimary }}>
                    <Flame className="w-5 h-5" style={{ color: theme.danger }} />
                    Heat Map Configuration
                  </h2>
                  <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                    Visualize patterns and trends with heat maps
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

              {/* Heat Map Type Selection */}
              <div className="space-y-3 mb-6">
                {heatMapTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onHeatMapTypeChange(type.id)}
                    className="w-full p-4 rounded-lg border text-left transition-all"
                    style={{
                      background: heatMapType === type.id ? `${type.color}10` : 'white',
                      borderColor: heatMapType === type.id ? type.color : theme.border,
                      borderWidth: heatMapType === type.id ? '2px' : '1px'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${type.color}15` }}
                      >
                        <type.icon className="w-6 h-6" style={{ color: type.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-black mb-1 flex items-center gap-2" style={{ color: theme.textPrimary }}>
                          {type.label}
                          {heatMapType === type.id && (
                            <CheckCircle2 className="w-4 h-4" style={{ color: type.color }} />
                          )}
                        </p>
                        <p className="text-xs mb-2" style={{ color: theme.textSecondary }}>
                          {type.description}
                        </p>
                        {type.gradient && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs" style={{ color: theme.textSecondary }}>
                              Gradient:
                            </span>
                            <div className="flex gap-1">
                              {type.gradient.map((color, idx) => (
                                <div
                                  key={idx}
                                  className="w-6 h-3 rounded"
                                  style={{ background: color }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Intensity Control */}
              {heatMapType !== 'none' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-lg border"
                  style={{
                    background: theme.background,
                    borderColor: theme.border
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-black" style={{ color: theme.textPrimary }}>
                        Heat Map Intensity
                      </p>
                      <p className="text-xs" style={{ color: theme.textSecondary }}>
                        Adjust visualization intensity
                      </p>
                    </div>
                    <Badge
                      className="text-sm px-3 py-1"
                      style={{
                        background: 'white',
                        color: theme.primary,
                        border: `1px solid ${theme.border}`
                      }}
                    >
                      {intensity}%
                    </Badge>
                  </div>
                  <Slider
                    min={10}
                    max={100}
                    step={10}
                    value={[intensity]}
                    onValueChange={([value]) => onIntensityChange(value)}
                    className="mb-2"
                  />
                  <div className="flex items-center justify-between text-xs" style={{ color: theme.textSecondary }}>
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </motion.div>
              )}

              {/* Info Box */}
              <div
                className="mt-4 p-4 rounded-lg border"
                style={{
                  background: `${theme.primary}05`,
                  borderColor: `${theme.primary}30`
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${theme.primary}20` }}
                  >
                    <Activity className="w-4 h-4" style={{ color: theme.primary }} />
                  </div>
                  <div>
                    <p className="text-xs font-black mb-1" style={{ color: theme.textPrimary }}>
                      Real-time Visualization
                    </p>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>
                      Heat maps update in real-time based on current data and filters. Use this feature to identify patterns, trends, and areas requiring attention.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
