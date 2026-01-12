import { motion, AnimatePresence } from 'motion/react';
import {
  Download, FileSpreadsheet, Printer, FileText, Share2, X,
  CheckCircle2, MapPin, Calendar, Filter as FilterIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

interface ExportMenuProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWard: string[];
  propertyTypes: string[];
  taxStatus: string;
}

export function GISExportMenu({ isOpen, onClose, selectedWard, propertyTypes, taxStatus }: ExportMenuProps) {
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

  const handleExport = (format: string) => {
    // Create mock CSV data
    const headers = ['Property No', 'Owner Name', 'Ward', 'Type', 'Tax Amount', 'Status', 'Last Payment'];
    const data = [
      ['WD1-NAU-001', 'Rajesh Kumar', 'Ward 1', 'Residential', '₹45,600', 'Paid', '2024-12-15'],
      ['WD2-KOP-145', 'Priya Sharma', 'Ward 2', 'Commercial', '₹128,400', 'Pending', '-'],
      ['WD4-WAG-289', 'Amit Patel', 'Ward 4', 'Industrial', '₹245,000', 'Partial', '2024-11-20'],
      ['WD3-VAR-067', 'Sunita Mehta', 'Ward 3', 'Residential', '₹52,300', 'Paid', '2024-12-18'],
      ['WD6-MAJ-234', 'Vikram Singh', 'Ward 6', 'Commercial', '₹165,800', 'Overdue', '2024-09-10']
    ];

    if (format === 'csv') {
      const csvContent = [
        headers.join(','),
        ...data.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `property_tax_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === 'excel') {
      // Simulate Excel export
      alert('Excel export functionality would generate an XLSX file with formatted data, charts, and summary statistics.');
    } else if (format === 'pdf') {
      // Simulate PDF export
      alert('PDF export functionality would generate a formatted report with maps, charts, and property details.');
    } else if (format === 'print') {
      window.print();
    }

    onClose();
  };

  const exportOptions = [
    {
      id: 'csv',
      label: 'Export as CSV',
      description: 'Comma-separated values for spreadsheet applications',
      icon: FileSpreadsheet,
      color: theme.success
    },
    {
      id: 'excel',
      label: 'Export as Excel',
      description: 'Formatted Excel workbook with charts and summaries',
      icon: FileSpreadsheet,
      color: '#217346'
    },
    {
      id: 'pdf',
      label: 'Export as PDF',
      description: 'Print-ready PDF report with maps and analytics',
      icon: FileText,
      color: theme.danger
    },
    {
      id: 'print',
      label: 'Print Report',
      description: 'Print current view directly to printer',
      icon: Printer,
      color: theme.primary
    }
  ];

  const activeFilters = [
    ...(selectedWard.length > 0 ? [`${selectedWard.length} Ward(s)`] : []),
    ...(propertyTypes.length > 0 ? [`${propertyTypes.length} Property Type(s)`] : []),
    ...(taxStatus !== 'all' ? [`Tax Status: ${taxStatus}`] : [])
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

          {/* Export Menu */}
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
                    <Download className="w-5 h-5" style={{ color: theme.primary }} />
                    Export Property Data
                  </h2>
                  <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                    Choose format to export filtered property tax data
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

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div
                  className="mb-6 p-4 rounded-lg border"
                  style={{
                    background: theme.background,
                    borderColor: theme.border
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FilterIcon className="w-4 h-4" style={{ color: theme.textSecondary }} />
                    <p className="text-xs font-black uppercase" style={{ color: theme.textSecondary }}>
                      Active Filters
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter, idx) => (
                      <Badge
                        key={idx}
                        className="text-xs px-2 py-1"
                        style={{
                          background: 'white',
                          color: theme.primary,
                          border: `1px solid ${theme.border}`
                        }}
                      >
                        {filter}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Export Options */}
              <div className="space-y-3 mb-6">
                {exportOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExport(option.id)}
                    className="w-full p-4 rounded-lg border text-left transition-all"
                    style={{
                      background: 'white',
                      borderColor: theme.border
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${option.color}15` }}
                      >
                        <option.icon className="w-6 h-6" style={{ color: option.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-black mb-1" style={{ color: theme.textPrimary }}>
                          {option.label}
                        </p>
                        <p className="text-xs" style={{ color: theme.textSecondary }}>
                          {option.description}
                        </p>
                      </div>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: theme.background }}
                      >
                        <Download className="w-4 h-4" style={{ color: theme.textSecondary }} />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Statistics Summary */}
              <div
                className="p-4 rounded-lg border"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}05 0%, ${theme.success}05 100%)`,
                  borderColor: theme.border
                }}
              >
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                      Properties
                    </p>
                    <p className="text-lg font-black" style={{ color: theme.textPrimary }}>
                      45,320
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                      Total Tax
                    </p>
                    <p className="text-lg font-black" style={{ color: theme.textPrimary }}>
                      ₹58.2 Cr
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                      Report Date
                    </p>
                    <p className="text-lg font-black" style={{ color: theme.textPrimary }}>
                      {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
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
