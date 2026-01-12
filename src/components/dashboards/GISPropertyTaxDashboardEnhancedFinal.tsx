import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download, BarChart3, SlidersHorizontal, TrendingUp, Info,
  Share2, Activity, Target, Flame, Zap
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { GISPropertyTaxDashboardFinal } from './GISPropertyTaxDashboardFinal';
import { GISAnalyticsPanel } from './GISAnalyticsPanel';
import { GISExportMenu } from './GISExportUtility';
import { GISAdvancedFilters, AdvancedFilterData } from './GISAdvancedFilters';
import { GISWardComparison } from './GISWardComparison';
import { GISHeatMapConfig } from './GISHeatMapConfig';
import { GISLiveStatsWidget } from './GISLiveStatsWidget';
import { GISQuickSearch } from './GISQuickSearch';

interface GISPropertyTaxDashboardEnhancedFinalProps {
  onBack?: () => void;
}

export function GISPropertyTaxDashboardEnhancedFinal({ onBack }: GISPropertyTaxDashboardEnhancedFinalProps) {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showHeatMapConfig, setShowHeatMapConfig] = useState(false);
  const [showLiveStats, setShowLiveStats] = useState(true);
  const [selectedWard, setSelectedWard] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [taxStatus, setTaxStatus] = useState<string>('all');
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterData | null>(null);
  const [heatMapType, setHeatMapType] = useState<string>('none');
  const [heatMapIntensity, setHeatMapIntensity] = useState<number>(60);

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

  const handleAdvancedFiltersApply = (filters: AdvancedFilterData) => {
    setAdvancedFilters(filters);
    console.log('Advanced filters applied:', filters);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Main Dashboard */}
      <GISPropertyTaxDashboardFinal onBack={onBack} />

      {/* Quick Search Bar */}
      <GISQuickSearch />

      {/* Live Statistics Widget */}
      {showLiveStats && <GISLiveStatsWidget />}

      {/* Enhanced Floating Action Buttons */}
      

      {/* Advanced Analytics Panel */}
      <AnimatePresence>
        {showAnalytics && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAnalytics(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-45"
            />

            {/* Analytics Panel */}
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-2xl z-50 shadow-2xl"
              style={{
                background: 'white',
                borderLeft: `2px solid ${theme.border}`
              }}
            >
              <GISAnalyticsPanel
                selectedWard={selectedWard}
                propertyTypes={propertyTypes}
                taxStatus={taxStatus}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Export Menu */}
      <GISExportMenu
        isOpen={showExportMenu}
        onClose={() => setShowExportMenu(false)}
        selectedWard={selectedWard}
        propertyTypes={propertyTypes}
        taxStatus={taxStatus}
      />

      {/* Advanced Filters */}
      <GISAdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApply={handleAdvancedFiltersApply}
      />

      {/* Ward Comparison */}
      <GISWardComparison
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />

      {/* Heat Map Config */}
      <GISHeatMapConfig
        isOpen={showHeatMapConfig}
        onClose={() => setShowHeatMapConfig(false)}
        heatMapType={heatMapType}
        onHeatMapTypeChange={setHeatMapType}
        intensity={heatMapIntensity}
        onIntensityChange={setHeatMapIntensity}
      />

      {/* Active Filters Indicator */}
      {advancedFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 right-6 z-40"
        >
          <Badge
            className="px-3 py-2 gap-2 cursor-pointer shadow-lg"
            style={{
              background: 'white',
              color: theme.primary,
              border: `2px solid ${theme.primary}`
            }}
            onClick={() => setShowAdvancedFilters(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-black">Advanced Filters Active</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setAdvancedFilters(null);
              }}
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: theme.danger }}
            >
              <span className="text-white text-xs">×</span>
            </motion.button>
          </Badge>
        </motion.div>
      )}
    </div>
  );
}