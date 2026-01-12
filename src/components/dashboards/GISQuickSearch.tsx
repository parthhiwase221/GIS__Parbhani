import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, MapPin, Building2, User, Hash, ChevronRight,
  TrendingUp, Clock, CheckCircle2, XCircle, X
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface SearchResult {
  id: string;
  type: 'property' | 'owner' | 'digipin';
  primaryText: string;
  secondaryText: string;
  ward: string;
  status: 'paid' | 'pending' | 'overdue';
  taxAmount: string;
  icon: typeof Building2;
}

export function GISQuickSearch() {
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

  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: 'WD4-2156',
      type: 'property',
      primaryText: 'WD4-2156-2',
      secondaryText: 'Residential Building, Wagle Estate',
      ward: 'Ward 4',
      status: 'paid',
      taxAmount: '₹45,600',
      icon: Building2
    },
    {
      id: 'WD2-3421',
      type: 'property',
      primaryText: 'WD2-3421-1',
      secondaryText: 'Commercial Complex, Kopri',
      ward: 'Ward 2',
      status: 'pending',
      taxAmount: '₹128,400',
      icon: Building2
    },
    {
      id: 'RAJESH',
      type: 'owner',
      primaryText: 'Rajesh Kumar Sharma',
      secondaryText: '3 properties owned',
      ward: 'Multiple',
      status: 'paid',
      taxAmount: '₹2,45,800',
      icon: User
    },
    {
      id: 'THANE2156',
      type: 'digipin',
      primaryText: 'THANE2156',
      secondaryText: 'Nehru Nagar, Near City Mall',
      ward: 'Ward 4',
      status: 'paid',
      taxAmount: '₹45,600',
      icon: MapPin
    },
    {
      id: 'WD1-1234',
      type: 'property',
      primaryText: 'WD1-1234-5',
      secondaryText: 'Industrial Unit, Naupada',
      ward: 'Ward 1',
      status: 'overdue',
      taxAmount: '₹245,000',
      icon: Building2
    }
  ];

  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (query.length > 0) {
      // Simulate search with debounce
      const timer = setTimeout(() => {
        const filtered = mockResults.filter(
          result =>
            result.primaryText.toLowerCase().includes(query.toLowerCase()) ||
            result.secondaryText.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setShowResults(true);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  // Auto-focus when expanded
  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && results.length > 0) {
      handleSelectResult(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setIsExpanded(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    console.log('Selected:', result);
    setQuery('');
    setShowResults(false);
    setIsExpanded(false);
    // Here you would typically open property details or navigate
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: { bg: `${theme.success}15`, color: theme.success, icon: CheckCircle2 },
      pending: { bg: `${theme.warning}15`, color: theme.warning, icon: Clock },
      overdue: { bg: `${theme.danger}15`, color: theme.danger, icon: XCircle }
    };

    const config = styles[status as keyof typeof styles];
    const Icon = config.icon;

    return (
      <Badge
        className="text-xs px-2 py-0.5 flex items-center gap-1"
        style={{
          background: config.bg,
          color: config.color,
          border: 'none'
        }}
      >
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        {/* Search component removed */}
      </div>
    </div>
  );
}