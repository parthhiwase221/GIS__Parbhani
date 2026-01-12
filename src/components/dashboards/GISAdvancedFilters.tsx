import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, SlidersHorizontal, IndianRupee, Home, Calendar,
  Building2, CheckCircle2, AlertCircle, RotateCcw, Filter as FilterIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: AdvancedFilterData) => void;
}

export interface AdvancedFilterData {
  taxAmountRange: { min: number; max: number };
  areaRange: { min: number; max: number };
  floorRange: { min: number; max: number };
  overdueMonths: number;
  assessmentYear: string;
  ownershipType: string[];
  gisTagged: string;
}

export function GISAdvancedFilters({ isOpen, onClose, onApply }: AdvancedFiltersProps) {
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

  // Filter states
  const [taxRange, setTaxRange] = useState([0, 500000]);
  const [areaRange, setAreaRange] = useState([0, 5000]);
  const [floorRange, setFloorRange] = useState([0, 20]);
  const [overdueMonths, setOverdueMonths] = useState(0);
  const [assessmentYear, setAssessmentYear] = useState('2024');
  const [ownershipTypes, setOwnershipTypes] = useState<string[]>([]);
  const [gisTagged, setGisTagged] = useState<string>('all');

  const handleReset = () => {
    setTaxRange([0, 500000]);
    setAreaRange([0, 5000]);
    setFloorRange([0, 20]);
    setOverdueMonths(0);
    setAssessmentYear('2024');
    setOwnershipTypes([]);
    setGisTagged('all');
  };

  const handleApply = () => {
    onApply({
      taxAmountRange: { min: taxRange[0], max: taxRange[1] },
      areaRange: { min: areaRange[0], max: areaRange[1] },
      floorRange: { min: floorRange[0], max: floorRange[1] },
      overdueMonths,
      assessmentYear,
      ownershipType: ownershipTypes,
      gisTagged
    });
    onClose();
  };

  const ownershipOptions = [
    { id: 'individual', label: 'Individual' },
    { id: 'society', label: 'Society/CHS' },
    { id: 'company', label: 'Company' },
    { id: 'trust', label: 'Trust' },
    { id: 'government', label: 'Government' }
  ];

  const toggleOwnership = (id: string) => {
    setOwnershipTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

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

          {/* Filters Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 overflow-y-auto"
            style={{
              background: 'white',
              borderLeft: `1px solid ${theme.border}`,
              boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.15)'
            }}
          >
            <div className="sticky top-0 z-10 p-6 border-b" style={{ background: 'white', borderColor: theme.border }}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-black flex items-center gap-2" style={{ color: theme.textPrimary }}>
                    <SlidersHorizontal className="w-5 h-5" style={{ color: theme.primary }} />
                    Advanced Filters
                  </h2>
                  <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                    Fine-tune property search criteria
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
            </div>

            <div className="p-6 space-y-6">
              {/* Tax Amount Range */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-black flex items-center gap-2" style={{ color: theme.textPrimary }}>
                    <IndianRupee className="w-4 h-4" style={{ color: theme.primary }} />
                    Tax Amount Range
                  </Label>
                  <Badge
                    className="text-xs px-2 py-0.5"
                    style={{
                      background: theme.background,
                      color: theme.textSecondary,
                      border: 'none'
                    }}
                  >
                    ₹{(taxRange[0] / 1000).toFixed(0)}K - ₹{(taxRange[1] / 1000).toFixed(0)}K
                  </Badge>
                </div>
                <Slider
                  min={0}
                  max={500000}
                  step={5000}
                  value={taxRange}
                  onValueChange={setTaxRange}
                  className="mb-2"
                />
                <div className="flex items-center gap-2 text-xs" style={{ color: theme.textSecondary }}>
                  <span>₹0</span>
                  <div className="flex-1 h-px" style={{ background: theme.border }} />
                  <span>₹5L</span>
                </div>
              </div>

              {/* Area Range */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-black flex items-center gap-2" style={{ color: theme.textPrimary }}>
                    <Home className="w-4 h-4" style={{ color: theme.primary }} />
                    Built-up Area (sq.ft)
                  </Label>
                  <Badge
                    className="text-xs px-2 py-0.5"
                    style={{
                      background: theme.background,
                      color: theme.textSecondary,
                      border: 'none'
                    }}
                  >
                    {areaRange[0]} - {areaRange[1]} sq.ft
                  </Badge>
                </div>
                <Slider
                  min={0}
                  max={5000}
                  step={100}
                  value={areaRange}
                  onValueChange={setAreaRange}
                  className="mb-2"
                />
                <div className="flex items-center gap-2 text-xs" style={{ color: theme.textSecondary }}>
                  <span>0 sq.ft</span>
                  <div className="flex-1 h-px" style={{ background: theme.border }} />
                  <span>5000 sq.ft</span>
                </div>
              </div>

              {/* Floor Range */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-black flex items-center gap-2" style={{ color: theme.textPrimary }}>
                    <Building2 className="w-4 h-4" style={{ color: theme.primary }} />
                    Number of Floors
                  </Label>
                  <Badge
                    className="text-xs px-2 py-0.5"
                    style={{
                      background: theme.background,
                      color: theme.textSecondary,
                      border: 'none'
                    }}
                  >
                    {floorRange[0]} - {floorRange[1]} floors
                  </Badge>
                </div>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={floorRange}
                  onValueChange={setFloorRange}
                  className="mb-2"
                />
                <div className="flex items-center gap-2 text-xs" style={{ color: theme.textSecondary }}>
                  <span>Ground</span>
                  <div className="flex-1 h-px" style={{ background: theme.border }} />
                  <span>20+ floors</span>
                </div>
              </div>

              {/* Overdue Period */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-black flex items-center gap-2" style={{ color: theme.textPrimary }}>
                    <AlertCircle className="w-4 h-4" style={{ color: theme.danger }} />
                    Overdue Period (Months)
                  </Label>
                  <Badge
                    className="text-xs px-2 py-0.5"
                    style={{
                      background: overdueMonths > 0 ? `${theme.danger}15` : theme.background,
                      color: overdueMonths > 0 ? theme.danger : theme.textSecondary,
                      border: 'none'
                    }}
                  >
                    {overdueMonths === 0 ? 'All' : `${overdueMonths}+ months`}
                  </Badge>
                </div>
                <Slider
                  min={0}
                  max={36}
                  step={3}
                  value={[overdueMonths]}
                  onValueChange={([value]) => setOverdueMonths(value)}
                  className="mb-2"
                />
                <div className="flex items-center gap-2 text-xs" style={{ color: theme.textSecondary }}>
                  <span>All</span>
                  <div className="flex-1 h-px" style={{ background: theme.border }} />
                  <span>36+ months</span>
                </div>
              </div>

              {/* Assessment Year */}
              <div>
                <Label className="text-sm font-black flex items-center gap-2 mb-3" style={{ color: theme.textPrimary }}>
                  <Calendar className="w-4 h-4" style={{ color: theme.primary }} />
                  Assessment Year
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {['2024', '2023', '2022', '2021', '2020', 'All'].map((year) => (
                    <Button
                      key={year}
                      variant="outline"
                      size="sm"
                      onClick={() => setAssessmentYear(year)}
                      className={`text-xs ${assessmentYear === year ? 'font-black' : ''}`}
                      style={{
                        background: assessmentYear === year ? theme.primary : 'white',
                        color: assessmentYear === year ? 'white' : theme.textSecondary,
                        borderColor: assessmentYear === year ? theme.primary : theme.border
                      }}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Ownership Type */}
              <div>
                <Label className="text-sm font-black flex items-center gap-2 mb-3" style={{ color: theme.textPrimary }}>
                  <Building2 className="w-4 h-4" style={{ color: theme.primary }} />
                  Ownership Type
                </Label>
                <div className="space-y-2">
                  {ownershipOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleOwnership(option.id)}
                      className="w-full p-3 rounded-lg border text-left transition-all"
                      style={{
                        background: ownershipTypes.includes(option.id) ? `${theme.primary}10` : 'white',
                        borderColor: ownershipTypes.includes(option.id) ? theme.primary : theme.border
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm"
                          style={{
                            color: ownershipTypes.includes(option.id) ? theme.primary : theme.textPrimary
                          }}
                        >
                          {option.label}
                        </span>
                        {ownershipTypes.includes(option.id) && (
                          <CheckCircle2 className="w-4 h-4" style={{ color: theme.primary }} />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* GIS Tagging Status */}
              <div>
                <Label className="text-sm font-black flex items-center gap-2 mb-3" style={{ color: theme.textPrimary }}>
                  <FilterIcon className="w-4 h-4" style={{ color: theme.primary }} />
                  GIS Tagging Status
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'tagged', label: 'Tagged' },
                    { id: 'untagged', label: 'Not Tagged' }
                  ].map((status) => (
                    <Button
                      key={status.id}
                      variant="outline"
                      size="sm"
                      onClick={() => setGisTagged(status.id)}
                      className={`text-xs ${gisTagged === status.id ? 'font-black' : ''}`}
                      style={{
                        background: gisTagged === status.id ? theme.primary : 'white',
                        color: gisTagged === status.id ? 'white' : theme.textSecondary,
                        borderColor: gisTagged === status.id ? theme.primary : theme.border
                      }}
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div
              className="sticky bottom-0 p-6 border-t bg-white"
              style={{ borderColor: theme.border }}
            >
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 gap-2"
                  style={{
                    borderColor: theme.border,
                    color: theme.textSecondary
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
                <Button
                  onClick={handleApply}
                  className="flex-1 gap-2"
                  style={{
                    background: theme.primary,
                    color: 'white'
                  }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}