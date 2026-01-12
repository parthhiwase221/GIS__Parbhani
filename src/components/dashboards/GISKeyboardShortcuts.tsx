import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard, Command, Search, Download, Filter as FilterIcon, BarChart3, Zap, Flame } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GISKeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
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

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['Ctrl', 'K'], description: 'Open Quick Search', icon: Search },
        { keys: ['Esc'], description: 'Close any open panel', icon: X },
        { keys: ['↑', '↓'], description: 'Navigate search results', icon: Command },
        { keys: ['Enter'], description: 'Select search result', icon: Command }
      ]
    },
    {
      category: 'Analytics',
      items: [
        { keys: ['Ctrl', 'A'], description: 'Toggle Analytics Panel', icon: BarChart3 },
        { keys: ['Ctrl', 'L'], description: 'Toggle Live Statistics', icon: Zap },
        { keys: ['Ctrl', 'H'], description: 'Open Heat Map Config', icon: Flame }
      ]
    },
    {
      category: 'Data Operations',
      items: [
        { keys: ['Ctrl', 'E'], description: 'Open Export Menu', icon: Download },
        { keys: ['Ctrl', 'F'], description: 'Open Advanced Filters', icon: FilterIcon },
        { keys: ['Ctrl', 'Shift', 'E'], description: 'Quick Export CSV', icon: Download }
      ]
    },
    {
      category: 'View Controls',
      items: [
        { keys: ['Ctrl', '+'], description: 'Zoom In Map', icon: Command },
        { keys: ['Ctrl', '-'], description: 'Zoom Out Map', icon: Command },
        { keys: ['Ctrl', '0'], description: 'Reset Map View', icon: Command },
        { keys: ['F'], description: 'Toggle Fullscreen', icon: Command }
      ]
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

          {/* Shortcuts Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl z-50"
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
                    <Keyboard className="w-6 h-6" style={{ color: theme.primary }} />
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                    Speed up your workflow with these shortcuts
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

              {/* Shortcuts Grid */}
              <div className="grid grid-cols-2 gap-6">
                {shortcuts.map((category, idx) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <h3 className="text-sm font-black mb-3 uppercase tracking-wide" style={{ color: theme.textSecondary }}>
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.items.map((item, itemIdx) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={itemIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (idx * 0.1) + (itemIdx * 0.05) }}
                            className="flex items-center justify-between p-3 rounded-lg border"
                            style={{
                              background: theme.background,
                              borderColor: theme.border
                            }}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <div
                                className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                                style={{ background: `${theme.primary}10` }}
                              >
                                <Icon className="w-4 h-4" style={{ color: theme.primary }} />
                              </div>
                              <span className="text-sm" style={{ color: theme.textPrimary }}>
                                {item.description}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {item.keys.map((key, keyIdx) => (
                                <div key={keyIdx} className="flex items-center gap-1">
                                  <kbd
                                    className="px-2 py-1 rounded text-xs font-black"
                                    style={{
                                      background: 'white',
                                      border: `2px solid ${theme.border}`,
                                      color: theme.textPrimary,
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                    }}
                                  >
                                    {key}
                                  </kbd>
                                  {keyIdx < item.keys.length - 1 && (
                                    <span className="text-xs" style={{ color: theme.textSecondary }}>+</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div
                className="mt-6 pt-4 border-t"
                style={{ borderColor: theme.border }}
              >
                <div
                  className="p-4 rounded-lg border flex items-start gap-3"
                  style={{
                    background: `${theme.primary}05`,
                    borderColor: `${theme.primary}30`
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${theme.primary}20` }}
                  >
                    <Command className="w-4 h-4" style={{ color: theme.primary }} />
                  </div>
                  <div>
                    <p className="text-sm font-black mb-1" style={{ color: theme.textPrimary }}>
                      Pro Tip
                    </p>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>
                      Press <kbd className="px-1 py-0.5 rounded text-xs font-black mx-1" style={{ background: 'white', border: `1px solid ${theme.border}` }}>?</kbd> anytime to view this shortcuts menu. Combine shortcuts for powerful workflow automation.
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
