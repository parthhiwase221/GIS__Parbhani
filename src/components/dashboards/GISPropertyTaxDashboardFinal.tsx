import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Home, FileText, DollarSign, AlertTriangle, Flame,
  ZoomIn, ZoomOut, Maximize2, RotateCcw, ChevronLeft, ChevronRight,
  Layers, Eye, EyeOff, Filter, X, Building2, Coins, FileCheck,
  Receipt, CreditCard, Menu, TrendingUp, Activity, Target,
  Navigation, Map as MapIcon, Box, Grid3x3, Droplet, Zap,
  Radio, Maximize, Globe, Flame as HeatmapIcon, Search, Bell,
  User, ChevronDown, Settings, Download, Calendar, BarChart3,
  PieChart, LineChart, CheckCircle2, Clock, XCircle, Factory,
  TreePine, ShoppingBag, Briefcase, MapPinned, Waves, Snowflake,
  Hash, Phone, Mail, Award, Send, Scale, MessageSquare, RefreshCw,
  Tag, Edit, Building, AlertCircle, Map
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { builtupPortionPolygonsEnhanced } from './buildup-portion-data-enhanced';
import QGISMapView from "../QGISMapView";


// All QGIS Layers - Complete list of 141 layers extracted from HTML
// Moved outside component to prevent re-creation on render
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const legacyAllQgisLayersList = [
  // MPMS PROPERTY (7 layers)
  { id: 'layer__140', name: 'महानगरपालिकेचची इमारती', color: '#f39ba3', propertyType: 'residential' },
  { id: 'layer__139', name: 'महानगरपालिकेचे रुग्णालय', color: '#729b6f', propertyType: 'hospital' },
  { id: 'layer__138', name: 'महानगरपालिकेची शाळा', color: '#8b6f47', propertyType: 'institutional' },
  { id: 'layer__137', name: 'महानगरपालिकेचे उद्यान/बगीचे', color: '#7fb347', propertyType: 'vacant' },
  { id: 'layer__136', name: 'महानगरपालिकेचे सार्वजनिक शौचालय', color: '#9ca3af', propertyType: 'public_toilets' },
  { id: 'layer__135', name: 'महानगरपालिकेची खुली जागा', color: '#8b6f47', propertyType: 'vacant' },
  { id: 'layer__134', name: 'महानगरपालिकेचची इमारती', color: '#d4a574', propertyType: 'residential' },
  // SECTOR 1 (30 layers)
  { id: 'layer_BF3_133', name: 'BF3', color: '#7fb347', propertyType: 'other' },
  { id: 'layer_Road_Bridge_across_RIVER3_132', name: 'Road_Bridge_across_RIVER3', color: '#8b6f47', propertyType: 'commercial' },
  { id: 'layer_ROAD_3_131', name: 'ROAD_3', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_PLU_3_130', name: 'PLU_3', color: '#729b6f', propertyType: 'residential' },
  { id: 'layer_KH_BND_129', name: 'KH_BND', color: '#9ca3af', propertyType: 'vacant' },
  { id: 'layer_P_ROAD_1_128', name: 'P_ROAD_1', color: '#8b5cf6', propertyType: 'commercial' },
  { id: 'layer_OS_2_127', name: 'OS_2', color: '#f39ba3', propertyType: 'vacant' },
  { id: 'layer_LAYOUT_OUTER_2_126', name: 'LAYOUT_OUTER_2', color: '#f97316', propertyType: 'residential' },
  { id: 'layer_LAYOUT_2_125', name: 'LAYOUT_2', color: '#ef4444', propertyType: 'residential' },
  { id: 'layer_CR_MCR_2_124', name: 'CR_MCR_2', color: '#f97316', propertyType: 'commercial' },
  { id: 'layer_BF_2_123', name: 'BF_2', color: '#8b5cf6', propertyType: 'residential' },
  { id: 'layer_ARROW_2_122', name: 'ARROW_2', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_YELLOW_PART_2_121', name: 'YELLOW_PART_2', color: '#f39ba3', propertyType: 'commercial' },
  { id: 'layer_ROAD_WIDTH_2_120', name: 'ROAD_WIDTH_2', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_Road_Bridge_across_RIVER1_119', name: 'Road_Bridge_across_RIVER1', color: '#ef4444', propertyType: 'commercial' },
  { id: 'layer_ROAD_2_118', name: 'ROAD_2', color: '#d4a574', propertyType: 'commercial' },
  { id: 'layer_RESERVATION_PART_2_117', name: 'RESERVATION_PART_2', color: '#8b6f47', propertyType: 'vacant' },
  { id: 'layer_RESERVATION_NO__NAME_PART_2_116', name: 'RESERVATION_NO_&_NAME_PART_2', color: '#9ca3af', propertyType: 'vacant' },
  { id: 'layer_PLU_2_115', name: 'PLU_2', color: '#7fb347', propertyType: 'residential' },
  { id: 'layer_P_ROAD_2_114', name: 'P_ROAD_2', color: '#8b5cf6', propertyType: 'commercial' },
  { id: 'layer_ARROW_113', name: 'ARROW', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_YELLOW_PART_1_112', name: 'YELLOW_PART_1', color: '#729b6f', propertyType: 'commercial' },
  { id: 'layer_ROAD_WIDTH_1_111', name: 'ROAD_WIDTH_1', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_Road_Bridge_across_RIVER_110', name: 'Road_Bridge_across_RIVER', color: '#8b6f47', propertyType: 'commercial' },
  { id: 'layer_ROAD_1P_109', name: 'ROAD_1P', color: '#d4a574', propertyType: 'commercial' },
  { id: 'layer_ROAD_1_108', name: 'ROAD_1', color: '#d4a574', propertyType: 'commercial' },
  { id: 'layer_RESERVATION_PART_1_107', name: 'RESERVATION_PART_1', color: '#8b6f47', propertyType: 'vacant' },
  { id: 'layer_RESERVATION_NO__NAME_PART_1_106', name: 'RESERVATION_NO_&_NAME_PART_1', color: '#9ca3af', propertyType: 'vacant' },
  { id: 'layer_PLU_1_105', name: 'PLU_1', color: '#7fb347', propertyType: 'residential' },
  { id: 'layer_OS_1_104', name: 'OS_1', color: '#f39ba3', propertyType: 'vacant' },
  { id: 'layer_BF_1_103', name: 'BF_1', color: '#8b5cf6', propertyType: 'residential' },
  { id: 'layer_AS_1_102', name: 'AS_1', color: '#729b6f', propertyType: 'residential' },
  // sub-group9 (104 layers)
  { id: 'layer_OS1_101', name: 'OS1', color: '#f39ba3', propertyType: 'vacant' },
  { id: 'layer_NEW_LAYOUT2_100', name: 'NEW_LAYOUT2', color: '#f97316', propertyType: 'residential' },
  { id: 'layer_MCR_99', name: 'MCR', color: '#8b5cf6', propertyType: 'commercial' },
  { id: 'layer_LAYOUT_98', name: 'LAYOUT', color: '#ef4444', propertyType: 'residential' },
  { id: 'layer_Export_Output_97', name: 'Export_Output', color: '#9ca3af', propertyType: 'commercial' },
  { id: 'layer_BRIDGE2_96', name: 'BRIDGE2', color: '#8b6f47', propertyType: 'commercial' },
  { id: 'layer_bf_2_95', name: 'bf_2', color: '#8b5cf6', propertyType: 'residential' },
  { id: 'layer_ARROW_94', name: 'ARROW', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_yellow_2_93', name: 'yellow_2', color: '#f39ba3', propertyType: 'commercial' },
  { id: 'layer_rt_92', name: 'rt', color: '#9ca3af', propertyType: 'commercial' },
  { id: 'layer_road_width_91', name: 'road_width', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_road_90', name: 'road', color: '#d4a574', propertyType: 'commercial' },
  { id: 'layer_reservation_89', name: 'reservation', color: '#8b6f47', propertyType: 'vacant' },
  { id: 'layer_R_name_88', name: 'R_name', color: '#9ca3af', propertyType: 'commercial' },
  { id: 'layer_praposed_road_87', name: 'praposed_road', color: '#8b6f47', propertyType: 'commercial' },
  { id: 'layer_plu_2_pt2_86', name: 'plu_2_pt2', color: '#7fb347', propertyType: 'residential' },
  { id: 'layer_OUTER_LAYOUT_2_85', name: 'OUTER_LAYOUT_2', color: '#f97316', propertyType: 'residential' },
  { id: 'layer_OS2_84', name: 'OS2', color: '#f39ba3', propertyType: 'vacant' },
  { id: 'layer_PLU_1_83', name: 'PLU_1', color: '#7fb347', propertyType: 'residential' },
  { id: 'layer_OUTER_LAYOUT_1_82', name: 'OUTER_LAYOUT_1', color: '#f97316', propertyType: 'residential' },
  { id: 'layer_OS1_81', name: 'OS1', color: '#f39ba3', propertyType: 'vacant' },
  { id: 'layer_NEW_LAYOUT_80', name: 'NEW_LAYOUT', color: '#f97316', propertyType: 'residential' },
  { id: 'layer_MRC_79', name: 'MRC', color: '#8b5cf6', propertyType: 'commercial' },
  { id: 'layer_LAYOUT_78', name: 'LAYOUT', color: '#ef4444', propertyType: 'residential' },
  { id: 'layer_ext_ROAD_77', name: 'ext_ROAD', color: '#d4a574', propertyType: 'commercial' },
  { id: 'layer_BRIDGE1_76', name: 'BRIDGE1', color: '#8b6f47', propertyType: 'commercial' },
  { id: 'layer_BF1_75', name: 'BF1', color: '#8b5cf6', propertyType: 'residential' },
  { id: 'layer_ARROW_74', name: 'ARROW', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_YELLOW_1_73', name: 'YELLOW_1', color: '#f39ba3', propertyType: 'commercial' },
  { id: 'layer_RT_72', name: 'RT', color: '#9ca3af', propertyType: 'commercial' },
  { id: 'layer_ROAD_WIDH_71', name: 'ROAD_WIDH', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_ROAD_70', name: 'ROAD', color: '#d4a574', propertyType: 'commercial' },
  { id: 'layer_RESERVATION_69', name: 'RESERVATION', color: '#8b6f47', propertyType: 'vacant' },
  { id: 'layer_RE_NAME_68', name: 'RE_NAME', color: '#9ca3af', propertyType: 'commercial' },
  { id: 'layer_PRAPOSED_ROAD_67', name: 'PRAPOSED_ROAD', color: '#8b6f47', propertyType: 'commercial' },
  { id: 'layer_LAYOUT_OUTER_1_66', name: 'LAYOUT_OUTER_1', color: '#f97316', propertyType: 'residential' },
  { id: 'layer_LAYOUT_1_65', name: 'LAYOUT_1', color: '#ef4444', propertyType: 'residential' },
  { id: 'layer_ELU_PT1_64', name: 'ELU_PT1', color: '#729b6f', propertyType: 'residential' },
  { id: 'layer_BF_PT_1_63', name: 'BF_PT_1', color: '#8b5cf6', propertyType: 'residential' },
  { id: 'layer_AS_1_62', name: 'AS_1', color: '#729b6f', propertyType: 'residential' },
  { id: 'layer_ARROW_PT_1_61', name: 'ARROW_PT_1', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_YELLOW_PT_1_60', name: 'YELLOW_PT_1', color: '#f39ba3', propertyType: 'commercial' },
  { id: 'layer_ROAD_PT_1_59', name: 'ROAD_PT_1', color: '#d4a574', propertyType: 'commercial' },
  { id: 'layer_RESERV_NAME_58', name: 'RESERV_NAME', color: '#9ca3af', propertyType: 'vacant' },
  { id: 'layer_RESER_1_57', name: 'RESER_1', color: '#8b6f47', propertyType: 'vacant' },
  { id: 'layer_RD_WIDTH_PT_1_56', name: 'RD_WIDTH_PT_1', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_PRAPOSED_ROAD_PT_1_55', name: 'PRAPOSED_ROAD_PT_1', color: '#8b6f47', propertyType: 'commercial' },
  { id: 'layer_PLU_PT_1_54', name: 'PLU_PT_1', color: '#7fb347', propertyType: 'residential' },
  { id: 'layer_PRAPOSED_ROAD_PT_2_53', name: 'PRAPOSED_ROAD_PT_2', color: '#8b6f47', propertyType: 'commercial' },
  { id: 'layer_PLU_PT_2_52', name: 'PLU_PT_2', color: '#7fb347', propertyType: 'residential' },
  { id: 'layer_OS_2_51', name: 'OS_2', color: '#f39ba3', propertyType: 'vacant' },
  { id: 'layer_LAYOUT_OUTER_2_50', name: 'LAYOUT_OUTER_2', color: '#f97316', propertyType: 'residential' },
  { id: 'layer_LAYOUT_2_49', name: 'LAYOUT_2', color: '#ef4444', propertyType: 'residential' },
  { id: 'layer_ELU_PT_2_48', name: 'ELU_PT_2', color: '#729b6f', propertyType: 'residential' },
  { id: 'layer_BF_PT_2_47', name: 'BF_PT_2', color: '#8b5cf6', propertyType: 'residential' },
  { id: 'layer_AS_2_46', name: 'AS_2', color: '#729b6f', propertyType: 'residential' },
  { id: 'layer_ARROW_PT_2_45', name: 'ARROW_PT_2', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_ARROW_2_44', name: 'ARROW_2', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_YELLLOW_PART_2_43', name: 'YELLLOW_PART_2', color: '#f39ba3', propertyType: 'commercial' },
  { id: 'layer_ROAD_PT_2_42', name: 'ROAD_PT_2', color: '#d4a574', propertyType: 'commercial' },
  { id: 'layer_RE_PT_2_41', name: 'RE_PT_2', color: '#9ca3af', propertyType: 'commercial' },
  { id: 'layer_RD_WIDTH_PT_2_40', name: 'RD_WIDTH_PT_2', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_BF_PT_3_39', name: 'BF_PT_3', color: '#8b5cf6', propertyType: 'residential' },
  { id: 'layer_YELLOW_PT3_38', name: 'YELLOW_PT3', color: '#f39ba3', propertyType: 'commercial' },
  { id: 'layer_WIDHTH_PT_3_37', name: 'WIDHTH_PT_3', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_ROAD_PT_3_36', name: 'ROAD_PT_3', color: '#d4a574', propertyType: 'commercial' },
  { id: 'layer_RESER_NAME_PT_3_35', name: 'RESER_NAME_PT_3', color: '#9ca3af', propertyType: 'vacant' },
  { id: 'layer_RESE_PT_3_34', name: 'RESE_PT_3', color: '#8b6f47', propertyType: 'vacant' },
  { id: 'layer_PLU_PART_3_33', name: 'PLU_PART_3', color: '#7fb347', propertyType: 'residential' },
  { id: 'layer_P_ROAD_PT3_32', name: 'P_ROAD_PT3', color: '#8b5cf6', propertyType: 'commercial' },
  { id: 'layer_LAYOUT_PT_3_31', name: 'LAYOUT_PT_3', color: '#ef4444', propertyType: 'residential' },
  { id: 'layer_ELU_PT_3_30', name: 'ELU_PT_3', color: '#729b6f', propertyType: 'residential' },
  { id: 'layer_E_ROAD_PT_3_29', name: 'E_ROAD_PT_3', color: '#d4a574', propertyType: 'commercial' },
  { id: 'layer_YELLOE_PT3_28', name: 'YELLOE_PT3', color: '#f39ba3', propertyType: 'commercial' },
  { id: 'layer_ROAD_WIDTH_PT_3_27', name: 'ROAD_WIDTH_PT_3', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_ROAD_PT3_26', name: 'ROAD_PT3', color: '#d4a574', propertyType: 'commercial' },
  { id: 'layer_NAME__NO_PT1_25', name: 'NAME_&_NO_PT1', color: '#9ca3af', propertyType: 'commercial' },
  { id: 'layer_LAYOUT_PT_1_24', name: 'LAYOUT_PT_1', color: '#ef4444', propertyType: 'residential' },
  { id: 'layer_EXISTING_ROAD_PT_1_23', name: 'EXISTING_ROAD_PT_1', color: '#d4a574', propertyType: 'commercial' },
  { id: 'layer_BF_1_22', name: 'BF_1', color: '#8b5cf6', propertyType: 'residential' },
  { id: 'layer_YELLOW_PT_1_21', name: 'YELLOW_PT_1', color: '#f39ba3', propertyType: 'commercial' },
  { id: 'layer_ROAD_WIDTH_PT_1_20', name: 'ROAD_WIDTH_PT_1', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_RESERVATION_PT_1_19', name: 'RESERVATION_PT_1', color: '#8b6f47', propertyType: 'vacant' },
  { id: 'layer_PRAPOSED_ROAD_PT_1_18', name: 'PRAPOSED_ROAD_PT_1', color: '#8b6f47', propertyType: 'commercial' },
  { id: 'layer_PLU_PT_1_17', name: 'PLU_PT_1', color: '#7fb347', propertyType: 'residential' },
  { id: 'layer_OUTER_LAYOUT_PT1_16', name: 'OUTER_LAYOUT_PT1', color: '#f97316', propertyType: 'residential' },
  { id: 'layer_OS_1_15', name: 'OS_1', color: '#f39ba3', propertyType: 'vacant' },
  { id: 'layer_MANE_AND_NO_PT_2_14', name: 'MANE_AND_NO_PT_2', color: '#9ca3af', propertyType: 'commercial' },
  { id: 'layer_LAYOUT_PT_2_13', name: 'LAYOUT_PT_2', color: '#ef4444', propertyType: 'residential' },
  { id: 'layer_EXI_ROAD_PT_2_12', name: 'EXI_ROAD_PT_2', color: '#d4a574', propertyType: 'commercial' },
  { id: 'layer_CANAL_ROAD_11', name: 'CANAL_ROAD', color: '#8b6f47', propertyType: 'commercial' },
  { id: 'layer_BF_2_10', name: 'BF_2', color: '#8b5cf6', propertyType: 'residential' },
  { id: 'layer_AS_2_9', name: 'AS_2', color: '#729b6f', propertyType: 'residential' },
  { id: 'layer_ARROW_PT_2_8', name: 'ARROW_PT_2', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_YELLOW_PT_2_7', name: 'YELLOW_PT_2', color: '#f39ba3', propertyType: 'commercial' },
  { id: 'layer_ROAD_WIDTH_PT2_6', name: 'ROAD_WIDTH_PT2', color: '#fbbf24', propertyType: 'commercial' },
  { id: 'layer_RESERVATION_PT_2_5', name: 'RESERVATION_PT_2', color: '#8b6f47', propertyType: 'vacant' },
  { id: 'layer_PLU_PT_2_4', name: 'PLU_PT_2', color: '#7fb347', propertyType: 'residential' },
  { id: 'layer_P_ROAD_PT_2_3', name: 'P_ROAD_PT_2', color: '#8b5cf6', propertyType: 'commercial' },
  { id: 'layer_OUTER_LAYOUT_PT2_2', name: 'OUTER_LAYOUT_PT2', color: '#f97316', propertyType: 'residential' },
  { id: 'layer_OS_2_1', name: 'OS_2', color: '#f39ba3', propertyType: 'vacant' },
  { id: 'layer_PLU_PT_3_0', name: 'PLU_PT_3', color: '#7fb347', propertyType: 'other' },
];

// Active QGIS layers pulled from the new export folder
const allQgisLayersList = [
  { id: 'layer__6', name: 'महानगरपालिकेचे सार्वजनिक शौचालय', color: '#8d5a99', propertyType: 'public_toilets' },
  { id: 'layer__11', name: 'महानगरपालिकेचे रुग्णालय', color: '#f3a6b2', propertyType: 'hospital' },
  { id: 'layer__10', name: 'महानगरपालिकेचे उद्यानबगीचे', color: '#729b6f', propertyType: 'vacant' },
  { id: 'layer__8', name: 'महानगरपालिकेची खुली जागा', color: '#e77148', propertyType: 'vacant' },
  { id: 'layer__9', name: 'महानगरपालिकेचची इमारती', color: '#b7484b', propertyType: 'residential' },
  { id: 'layer__7', name: 'महानगरपालिकेची शाळा', color: '#d5b43c', propertyType: 'institutional' },
  { id: 'layer_BuildingFootprints_5', name: 'Building Footprints', color: '#ff0101', propertyType: 'building_footprints' },
  { id: 'layer_RESERVATION_4', name: 'Reservation', color: '#b2df8a', propertyType: 'vacant' },
  { id: 'layer_RESIDENTIAL_3', name: 'Residential', color: '#fdbf6f', propertyType: 'residential' },
  { id: 'layer_ROAD_2', name: 'Road', color: '#646464', propertyType: 'other' },
  { id: 'layer_ExistingLandUse_1', name: 'Existing Land Use', color: '#e5b636', propertyType: 'other' },
  { id: 'layer_ProposeLandUse_0', name: 'Proposed Land Use', color: '#e15989', propertyType: 'other' },
];

// Group layers by property type (Moved outside)
const layersByPropertyType = {
  residential: allQgisLayersList.filter(l => l.propertyType === 'residential'),
  hospital: allQgisLayersList.filter(l => l.propertyType === 'hospital'),
  public_toilets: allQgisLayersList.filter(l => l.propertyType === 'public_toilets'),
  institutional: allQgisLayersList.filter(l => l.propertyType === 'institutional'),
  vacant: allQgisLayersList.filter(l => l.propertyType === 'vacant'),
  other: allQgisLayersList.filter(l => l.propertyType === 'other' || !l.propertyType),
};

// Initialize all layers state (all enabled by default)
const initialLayersState: Record<string, boolean> = {};
allQgisLayersList.forEach(layer => {
  initialLayersState[layer.id] = true;
});

interface GISPropertyTaxDashboardFinalProps {
  onBack?: () => void;
}

export function GISPropertyTaxDashboardFinal({ onBack }: GISPropertyTaxDashboardFinalProps) {
  // UI State
  const [sidebarTab, setSidebarTab] = useState<'filters' | 'layers' | 'workflow' | 'complaints'>('layers');
  const [mapView, setMapView] = useState<'satellite2d' | 'satellite3d' | 'standard' | 'heatmap'>('satellite2d');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);

  // Map State
  const [mapZoom, setMapZoom] = useState(14);
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedWard, setSelectedWard] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showLegend, setShowLegend] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'general' | 'digipin'>('general');

  // Enhanced Workflow & Property State
  const [showWorkflowTimeline, setShowWorkflowTimeline] = useState(false);
  const [activeWorkflowStage, setActiveWorkflowStage] = useState<string>('');
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);

  // Boundary Layers State
  const [boundaryLayers, setBoundaryLayers] = useState({
    municipal: true,
    zone: true,
    ward: false,  // Only after Gat Lipik confirmation
    builtupPortion: false  // Built-up portion polygon mapping
  });

  // Filter State (Auto-apply - no need for Apply button)
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [taxStatus, setTaxStatus] = useState<string>('all');
  const [landUse, setLandUse] = useState<string[]>([]);
  const [riskZones, setRiskZones] = useState({
    flood: false,
    earthquake: false,
    complaints: false
  });

  // Layer State
  const [baseLayers, setBaseLayers] = useState({
    street: false,
    satellite: true,
    hybrid: false
  });

  const [propertyLayers, setPropertyLayers] = useState({
    boundaries: true,
    footprints: true,
    buildings3d: false
  });

  const [taxLayers, setTaxLayers] = useState({
    paymentStatus: true,
    assessmentValue: false,
    classification: true
  });

  const [utilityLayers, setUtilityLayers] = useState({
    water: false,
    sewage: false,
    power: false
  });

  const [riskLayers, setRiskLayers] = useState({
    riskZones: false,
    complaintHotspots: false
  });

  // Property Type Filter State
  const [selectedPropertyTypeFilter, setSelectedPropertyTypeFilter] = useState<string | null>(null);





  const [qgisLayers, setQgisLayers] = useState<Record<string, boolean>>(initialLayersState);
  const [isMapReady, setIsMapReady] = useState(false);



  // Get filtered layers based on selected property type
  const getFilteredLayers = () => {
    if (!selectedPropertyTypeFilter) {
      return allQgisLayersList;
    }
    return layersByPropertyType[selectedPropertyTypeFilter as keyof typeof layersByPropertyType] || [];
  };

  // Ref for iframe to send messages
  const mapIframeRef = useRef<HTMLIFrameElement>(null);

  // Send message to iframe to toggle layer
  const sendLayerToggleMessage = (layerId: string, visible: boolean) => {
    const iframe = mapIframeRef.current;
    if (iframe?.contentWindow) {
      try {
        iframe.contentWindow.postMessage({
          type: 'toggleLayer',
          layerId: layerId,
          visible: visible
        }, '*');
        console.log('Sent toggleLayer message:', layerId, visible);
      } catch (e) {
        console.error('Error sending toggleLayer message:', e);
      }
    } else {
      console.warn('Iframe not ready for toggleLayer:', layerId);
      // Retry after a short delay
      setTimeout(() => {
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'toggleLayer',
            layerId: layerId,
            visible: visible
          }, '*');
        }
      }, 100);
    }
  };

  // Send message to iframe to highlight layers (blinking + neon border)
  const sendHighlightMessage = (layerIds: string[]) => {
    const iframe = mapIframeRef.current;
    if (iframe?.contentWindow) {
      try {
        iframe.contentWindow.postMessage({
          type: 'highlightLayers',
          layerIds: layerIds
        }, '*');
        console.log('Sent highlightLayers message:', layerIds);
      } catch (e) {
        console.error('Error sending highlightLayers message:', e);
      }
    } else {
      console.warn('Iframe not ready for highlightLayers');
      setTimeout(() => {
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'highlightLayers',
            layerIds: layerIds
          }, '*');
        }
      }, 100);
    }
  };

  // Send bulk message to iframe to update layer visibility
  const sendLayerVisibilityUpdateMessage = (updates: { id: string, visible: boolean }[]) => {
    const iframe = mapIframeRef.current;
    if (iframe?.contentWindow) {
      try {
        iframe.contentWindow.postMessage({
          type: 'updateLayerVisibility',
          updates: updates
        }, '*');
        console.log('Sent updateLayerVisibility message:', updates.length, 'updates');
      } catch (e) {
        console.error('Error sending updateLayerVisibility message:', e);
      }
    } else {
      console.warn('Iframe not ready for updateLayerVisibility');
      // Retry after a short delay
      setTimeout(() => {
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'updateLayerVisibility',
            updates: updates
          }, '*');
        }
      }, 100);
    }
  };

  // Clear highlight from specific layers or all when omitted
  const sendClearHighlightMessage = (layerIds?: string[]) => {
    const iframe = mapIframeRef.current;
    if (iframe?.contentWindow) {
      try {
        iframe.contentWindow.postMessage({
          type: 'clearHighlights',
          layerIds
        }, '*');
        console.log('Sent clearHighlights message:', layerIds);
      } catch (e) {
        console.error('Error sending clearHighlights message:', e);
      }
    } else {
      console.warn('Iframe not ready for clearHighlights');
      setTimeout(() => {
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'clearHighlights',
            layerIds
          }, '*');
        }
      }, 100);
    }
  };

  // Building Footprints is NOT forced on - it's controlled by Residential tab + Show All
  const forcedOnLayers = new Set<string>([]);

  const toggleQgisLayer = (layerId: string) => {
    const newValue = !qgisLayers[layerId];

    if (forcedOnLayers.has(layerId)) {
      sendLayerToggleMessage(layerId, true);
      return;
    }

    // Auto-reset logic: If user unchecks the LAST visible layer while a filter is active
    if (selectedPropertyTypeFilter && !newValue) {
      const filteredLayers = layersByPropertyType[selectedPropertyTypeFilter as keyof typeof layersByPropertyType] || [];
      // Count currently visible layers in this filter (excluding the one being toggled off)
      const visibleCount = filteredLayers.filter(l => qgisLayers[l.id] && l.id !== layerId).length;

      if (visibleCount === 0) {
        // Reset to "All Properties" (shows all layers)
        togglePropertyTypeFilter(null);
        return;
      }
    }

    setQgisLayers(prev => ({
      ...prev,
      [layerId]: newValue
    }));
    sendLayerToggleMessage(layerId, newValue);
  };

  const togglePropertyTypeFilter = (propertyType: string | null) => {
    const previousFilter = selectedPropertyTypeFilter;
    setSelectedPropertyTypeFilter(propertyType);

    // Always clear previous highlights first
    if (previousFilter) {
      const prevLayers = layersByPropertyType[previousFilter as keyof typeof layersByPropertyType] || [];
      sendClearHighlightMessage(prevLayers.map(l => l.id));
    }

    // Build new visibility state
    const newState: Record<string, boolean> = {};
    const updates: { id: string, visible: boolean }[] = [];

    allQgisLayersList.forEach(layer => {
      // Forced layers always on
      if (forcedOnLayers.has(layer.id)) {
        newState[layer.id] = true;
        updates.push({ id: layer.id, visible: true });
        return;
      }
      if (propertyType) {
        // Only layers of the selected type on, PLUS context layers like roads ('other')
        // Explicitly HIDES 'building_footprints' since it doesn't match 'residential' anymore
        const isVisible = layer.propertyType === propertyType || layer.propertyType === 'other';
        newState[layer.id] = isVisible;
        updates.push({ id: layer.id, visible: isVisible });
      } else {
        // No filter -> all on
        newState[layer.id] = true;
        updates.push({ id: layer.id, visible: true });
      }
    });

    // Apply visibility and send BULK message
    setQgisLayers(newState);
    sendLayerVisibilityUpdateMessage(updates);

    // If a property type is being selected, highlight all its layers
    if (propertyType) {
      const typeLayers = layersByPropertyType[propertyType as keyof typeof layersByPropertyType] || [];
      const layerIds = typeLayers.map(layer => layer.id);
      if (layerIds.length > 0) {
        // Small delay to ensure previous highlights are cleared first
        setTimeout(() => {
          sendHighlightMessage(layerIds);
        }, 50);
      }
    } else {
      // Clearing filter -> clear highlights
      sendClearHighlightMessage();
    }
  };

  const toggleAllLayersForPropertyType = (propertyType: string, value: boolean) => {
    const typeLayers = layersByPropertyType[propertyType as keyof typeof layersByPropertyType] || [];
    const updates: Record<string, boolean> = {};
    const bulkUpdates: { id: string, visible: boolean }[] = [];

    typeLayers.forEach(layer => {
      updates[layer.id] = value;
      bulkUpdates.push({ id: layer.id, visible: value });
    });

    setQgisLayers(prev => ({ ...prev, ...updates }));
    sendLayerVisibilityUpdateMessage(bulkUpdates);
  };

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'mapReady') {
        console.log('Map is ready, syncing layers');
        setIsMapReady(true);
      }
      if (event.data && event.data.type === 'layerStateUpdate') {
        console.log('Received layerStateUpdate:', event.data.activeLayerIds);
        setActiveLayerIds(event.data.activeLayerIds || []);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Keep map layers in sync with the latest state once the map is ready
  // Keep map layers in sync with the latest state once the map is ready
  // REMOVED: Redundant useEffect that caused message flood. 
  // State sync is now handled explicitly by toggle handlers (toggleQgisLayer, togglePropertyTypeFilter, etc.)
  /*
  useEffect(() => {
    if (!isMapReady) return;
    Object.entries(qgisLayers).forEach(([layerId, visible]) => {
      sendLayerToggleMessage(layerId, Boolean(visible));
    });
  }, [isMapReady, qgisLayers]);
  */

  // Sync layer states when component mounts or iframe loads
  useEffect(() => {
    // Wait for iframe to load, then sync all layer states
    const iframe = mapIframeRef.current;
    if (iframe) {
      const handleLoad = () => {
        // Longer delay to ensure map is fully initialized
        setTimeout(() => {
          Object.entries(qgisLayers).forEach(([layerId, visible]) => {
            sendLayerToggleMessage(layerId, Boolean(visible));
          });
        }, 2000);
      };

      // If iframe is already loaded, sync immediately
      if (iframe.contentDocument?.readyState === 'complete') {
        handleLoad();
      } else {
        iframe.addEventListener('load', handleLoad);
        return () => iframe.removeEventListener('load', handleLoad);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Simulated live update
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Enhanced Color System (Municipal GIS Standards)
  const theme = {
    // Primary Colors
    primary: '#1D4ED8',
    primaryLight: '#3B82F6',
    secondary: '#0EA5E9',
    secondaryLight: '#38BDF8',

    // Status Colors
    success: '#16A34A',
    successLight: '#22C55E',
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    danger: '#DC2626',
    dangerLight: '#EF4444',

    // Backgrounds
    background: '#F3F4F6',
    panelBg: '#FFFFFF',
    sidebarBg: '#F7F9FC',
    cardBg: '#FDFEFF',

    // Text
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',

    // Borders & Strokes
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    stroke: '#D1D5DB',

    // Shadows
    shadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    shadowMd: '0px 4px 6px rgba(0, 0, 0, 0.07), 0px 2px 4px rgba(0, 0, 0, 0.06)',
    shadowLg: '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
    shadowXl: '0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)',
  };

  // Ward data
  const wards = [
    { id: 'ward1', name: 'Ward 1', properties: 2840 },
    { id: 'ward2', name: 'Ward 2', properties: 3120 },
    { id: 'ward3', name: 'Ward 3', properties: 2650 },
    { id: 'ward4', name: 'Ward 4', properties: 4230 },
    { id: 'ward5', name: 'Ward 5', properties: 3890 },
    { id: 'ward6', name: 'Ward 6', properties: 2940 }
  ];

  // Property type options
  // Property type options with counts REMOVED
  const propertyTypeOptions = [
    { id: 'residential', label: 'Residential', icon: Home },
    { id: 'hospital', label: 'Hospital', icon: Activity },
    { id: 'institutional', label: 'Institutional', icon: Briefcase },
    { id: 'vacant', label: 'Vacant Land', icon: TreePine },
    { id: 'public_toilets', label: 'Public Toilets', icon: Factory },
    { id: 'other', label: 'Other', icon: Map },
  ];

  // Tax status options
  const taxStatusOptions = [
    { id: 'all', label: 'All', count: 45320 },
    { id: 'paid', label: 'Paid', color: theme.success, count: 35280 },
    { id: 'partial', label: 'Partially Paid', color: theme.warning, count: 4820 },
    { id: 'overdue1', label: 'Overdue > 1 year', color: theme.danger, count: 3140 },
    { id: 'overdue3', label: 'Overdue > 3 years', color: theme.dangerLight, count: 2080 }
  ];

  // KPI Data
  // Dynamic Stats State
  const [activeLayerIds, setActiveLayerIds] = useState<string[]>([]);

  // Layer Statistical Weights (Mocked for realism)
  const layerWeights = {
    // MPMS PROPERTY
    'layer__11': { assets: 124, movable: 45, fixed: 79, value: 1250000 }, // Toilets
    'layer__10': { assets: 18, movable: 5, fixed: 13, value: 8500000 },  // Hospital
    'layer__9': { assets: 45, movable: 0, fixed: 45, value: 4200000 },   // Gardens
    'layer__8': { assets: 320, movable: 0, fixed: 320, value: 15600000 }, // Open Space
    'layer__7': { assets: 85, movable: 20, fixed: 65, value: 24500000 }, // Buildings
    'layer__6': { assets: 56, movable: 12, fixed: 44, value: 18400000 }, // Schools

    // Sectors / Land Use (Base values per layer)
    'layer_RESIDENTIAL_3': { assets: 540, movable: 480, fixed: 60, value: 45000000 },
    'layer_RESERVATION_4': { assets: 85, movable: 0, fixed: 85, value: 12000000 },
    'layer_ROAD_2': { assets: 120, movable: 80, fixed: 40, value: 3500000 },
    'layer_BuildingFootprints_5': { assets: 850, movable: 720, fixed: 130, value: 65000000 },
    'layer_ExistingLandUse_1': { assets: 450, movable: 200, fixed: 250, value: 28000000 },
    'layer_ProposeLandUse_0': { assets: 180, movable: 50, fixed: 130, value: 15000000 },
  };

  // Base constant values to ensure we always have some data
  const BASE_STATS = { assets: 1800, movable: 240, fixed: 320, value: 45000000 };

  // Calculate live numbers from visible layers
  const calculateDynamicStats = () => {
    // If no layers are active, show a baseline or empty
    if (activeLayerIds.length === 0) return BASE_STATS;

    return activeLayerIds.reduce((acc, id) => {
      const weight = layerWeights[id as keyof typeof layerWeights] || { assets: 45, movable: 20, fixed: 25, value: 1200000 };
      return {
        assets: acc.assets + weight.assets,
        movable: acc.movable + weight.movable,
        fixed: acc.fixed + weight.fixed,
        value: acc.value + weight.value
      };
    }, { assets: 0, movable: 0, fixed: 0, value: 0 });
  };

  const dynamicStats = calculateDynamicStats();
  const assetValue = dynamicStats.value.toLocaleString('en-IN');

  const kpiData = [
    {
      label: 'Total Assets',
      value: dynamicStats.assets.toLocaleString('en-IN'),
      change: '+2.4%',
      trend: 'up',
      icon: Building2,
      color: theme.primary
    },
    {
      label: 'Movable Assets',
      value: dynamicStats.movable.toLocaleString('en-IN'),
      subtext: `${activeLayerIds.length} active layers`,
      progress: Math.round((dynamicStats.movable / dynamicStats.assets) * 100) || 0,
      icon: Target,
      color: theme.success
    },
    {
      label: 'Fixed Assets',
      value: dynamicStats.fixed.toLocaleString('en-IN'),
      subtext: 'Property verified',
      icon: DollarSign,
      color: theme.danger
    },
    {
      label: 'Asset Values',
      value: `₹${assetValue}`,
      subtext: 'Calculated value',
      icon: AlertTriangle,
      color: theme.warning
    }
  ];

  // Complaints data
  const complaints = [
    {
      id: 'C1023',
      title: 'Water leakage near Parcel #A1023',
      status: 'open',
      category: 'water',
      ward: 'Ward 4',
      date: '2024-01-18',
      severity: 'high'
    },
    {
      id: 'C1024',
      title: 'Tax assessment dispute',
      status: 'in_progress',
      category: 'tax',
      ward: 'Ward 2',
      date: '2024-01-17',
      severity: 'medium'
    },
    {
      id: 'C1025',
      title: 'Road damage near property',
      status: 'resolved',
      category: 'roads',
      ward: 'Ward 1',
      date: '2024-01-15',
      severity: 'low'
    }
  ];

  // Municipal Workflow Stages
  const workflowStages = [
    { id: 'boundary', label: 'Boundary Finalization', icon: MapPin, color: '#3b82f6', count: 15, description: 'Municipal, Zone & Ward boundaries' },
    { id: 'tagging', label: 'Property Tagging', icon: Tag, color: '#8b5cf6', count: 1247, description: 'Tag built-up structures' },
    { id: 'numbering', label: 'Numbering', icon: Hash, color: '#ec4899', count: 1247, description: 'Assign property numbers' },
    { id: 'survey', label: 'Physical Survey', icon: Search, color: '#f59e0b', count: 856, description: 'On-ground verification' },
    { id: 'entry', label: 'Data Entry', icon: Edit, color: '#10b981', count: 856, description: 'Enter survey data' },
    { id: 'planning', label: 'Map Planning', icon: Map, color: '#06b6d4', count: 745, description: 'Create digital maps' },
    { id: 'qc', label: 'QC Check', icon: CheckCircle2, color: '#14b8a6', count: 623, description: 'Quality control' },
    { id: 'finalization', label: 'Finalization', icon: FileCheck, color: '#84cc16', count: 589, description: 'Final approval' },
    { id: 'sr', label: 'SR1/SR2 Distribution', icon: FileText, color: '#eab308', count: 589, description: 'Distribute reports' },
    { id: 'notice', label: 'Notice Issuance', icon: Bell, color: '#f97316', count: 421, description: 'Issue tax notices' },
    { id: 'complaint', label: 'Complaint Handling', icon: MessageSquare, color: '#ef4444', count: 87, description: 'Address complaints' },
    { id: 'hearing', label: 'Hearing', icon: Scale, color: '#dc2626', count: 34, description: 'Conduct hearings' },
    { id: 'correction', label: 'Correction', icon: AlertCircle, color: '#f59e0b', count: 29, description: 'Make corrections' },
    { id: 'republish', label: 'Re-Publish', icon: RefreshCw, color: '#8b5cf6', count: 29, description: 'Republish records' },
    { id: 'appeal', label: 'Appeal Handling', icon: Send, color: '#6366f1', count: 12, description: 'Process appeals' }
  ];

  // Mock detailed property data for property detail panel
  const mockPropertyData = {
    // Core Information
    propertyNo: 'WD4-2156-2',
    division: 'Division A',
    description: 'Residential Building with Commercial Ground Floor',
    blockNo: 'B-12',
    plotNo: 'P-456',
    plotArea: 1250,
    surveyNo: 'S-789/2',
    upicId: 'UPIC123456789',
    taxZone: 'Zone-2',
    subZone: 'SubZone-2A',
    carpetArea: 980,
    builtUpArea: 1150,

    // Ownership
    ownerType: 'Individual',
    ownerTitle: 'Mr.',
    holderName: 'Rajesh Kumar Sharma',
    occupierName: 'Self',
    shopName: 'Kumar Electronics',

    // Contact
    address: '123, Nehru Nagar, Near City Mall',
    wing: 'A',
    flatNo: '401',
    landmark: 'Opposite HDFC Bank',
    pincode: '400601',
    digiPin: 'THANE2156',
    mobile: '+91 98765 43210',
    email: 'rajesh.sharma@example.com',
    aadharNo: '1234-5678-9012',

    // Assessment
    isAssessed: true,
    assessmentDate: '2024-01-15',
    taxAmount: 45600,
    status: 'Paid',

    // Society Data (if applicable)
    isSociety: true,
    societyData: {
      landOwner: 'Thane Development Corporation',
      builderName: 'Sharma Constructions Pvt Ltd',
      societyName: 'Nehru Nagar CHS',
      secretaryName: 'Mr. Anil Verma',
      secretaryMobile: '+91 98765 12345',
      secretaryEmail: 'secretary@nehrunagar.com',
      societyAddress: 'Nehru Nagar, Thane West',
      societyEmail: 'office@nehrunagar.com',
      commencementCertNo: 'CC/2020/1234',
      commencementCertDate: '2020-03-15',
      occupancyCertNo: 'OC/2021/5678',
      occupancyCertDate: '2021-11-20',
      possessionCertNo: 'PC/2021/9012',
      possessionCertDate: '2021-12-01',
      indexIINo: 'IDX-II/2021/456',
      indexIIDate: '2021-12-15',
      electricityBillNo: 'EB-123456789',
      electricityBillDate: '2024-01-05',
      discount: null,
      wings: [
        {
          name: 'A',
          properties: [
            { unitNo: 'A-101', isAssessed: true },
            { unitNo: 'A-102', isAssessed: true },
            { unitNo: 'A-201', isAssessed: true },
            { unitNo: 'A-202', isAssessed: false },
            { unitNo: 'A-301', isAssessed: true },
            { unitNo: 'A-302', isAssessed: true },
            { unitNo: 'A-401', isAssessed: true },
            { unitNo: 'A-402', isAssessed: false }
          ]
        },
        {
          name: 'B',
          properties: [
            { unitNo: 'B-101', isAssessed: true },
            { unitNo: 'B-102', isAssessed: true },
            { unitNo: 'B-201', isAssessed: false },
            { unitNo: 'B-202', isAssessed: true }
          ]
        }
      ]
    },

    // Documents
    documents: {
      karaakaraniReport: true,
      noticeBill: true,
      noDueCert: true
    },

    // Old Records
    oldDetails: {
      propertyNo: 'OLD-WD2-1234',
      ward: 'Old Ward 2',
      taxAmount: '₹32,500',
      lastUpdated: '2020-12-31'
    }
  };

  const toggleWard = (wardId: string) => {
    setSelectedWard(prev =>
      prev.includes(wardId)
        ? prev.filter(w => w !== wardId)
        : [...prev, wardId]
    );
  };

  const togglePropertyType = (typeId: string) => {
    setPropertyTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  const resetFilters = () => {
    setSelectedWard([]);
    setPropertyTypes([]);
    setTaxStatus('all');
    setLandUse([]);
    setRiskZones({ flood: false, earthquake: false, complaints: false });
  };

  const handleResetView = () => {
    setMapZoom(14);
    setSelectedProperty(null);
  };

  const handleWorkflowStageClick = (stageId: string) => {
    setActiveWorkflowStage(activeWorkflowStage === stageId ? '' : stageId);
  };

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(mockPropertyData); // Use mock data for now
    setShowPropertyDetail(true);
  };

  const handleDigiPINSearch = () => {
    if (searchQuery && searchType === 'digipin') {
      // Simulate DigiPIN search
      handlePropertyClick(mockPropertyData);
    }
  };

  // Calculate filter count
  const activeFilterCount = selectedWard.length + propertyTypes.length + (taxStatus !== 'all' ? 1 : 0);
  const activeLayerCount = Object.values(utilityLayers).filter(Boolean).length + Object.values(riskLayers).filter(Boolean).length;

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: theme.background }}>
      {/* Top App Bar with KPI Cards */}
      <header
        className="border-b flex-shrink-0 flex flex-col"
        style={{
          background: theme.panelBg,
          borderColor: theme.border,
          boxShadow: theme.shadow
        }}
      >
        {/* Top Row - Navigation & Search */}
        <div className="h-18 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button onClick={onBack} variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}

            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: theme.primary }}
              >
                <MapIcon className="w-5 h-5 text-white" />
              </div>

              <div>
                <h1 className="text-base font-bold" style={{ color: theme.textPrimary }}>
                  Municipal GIS - Property Tax Dashboard
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-xs" style={{ color: theme.textSecondary }}>
                    Parbhani Municipal Corporation
                  </p>
                  {isLive && (
                    <Badge className="text-xs px-2 py-0" style={{ background: `${theme.success}20`, color: theme.success, border: 'none' }}>
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full mr-1.5 inline-block"
                        style={{ background: theme.success }}
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      LIVE
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Global Search Bar with DigiPIN */}
          <div className="flex-1 max-w-xl mx-8">
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border"
              style={{
                background: theme.background,
                borderColor: searchType === 'digipin' ? theme.primary : theme.border
              }}
            >
              <Search className="w-4 h-4" style={{ color: theme.textSecondary }} />
              <input
                type="text"
                placeholder={searchType === 'digipin' ? "Search by DigiPIN (e.g. THANE2156)..." : "Search by owner name, parcel ID, or address..."}
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleDigiPINSearch()}
                className="flex-1 bg-transparent border-none outline-none text-sm"
                style={{ color: theme.textPrimary }}
              />
              <div className="flex items-center gap-1">
                <Badge
                  onClick={() => setSearchType('general')}
                  className="text-xs px-2 py-0.5 cursor-pointer"
                  style={{
                    background: searchType === 'general' ? theme.primary : theme.borderLight,
                    color: searchType === 'general' ? 'white' : theme.textSecondary,
                    border: 'none'
                  }}
                >
                  Owner
                </Badge>
                <Badge
                  onClick={() => setSearchType('general')}
                  className="text-xs px-2 py-0.5 cursor-pointer"
                  style={{ background: theme.borderLight, color: theme.textSecondary, border: 'none' }}
                >
                  Parcel ID
                </Badge>
                <Badge
                  onClick={() => setSearchType('digipin')}
                  className="text-xs px-2 py-0.5 cursor-pointer flex items-center gap-1"
                  style={{
                    background: searchType === 'digipin' ? theme.primary : theme.borderLight,
                    color: searchType === 'digipin' ? 'white' : theme.textSecondary,
                    border: 'none'
                  }}
                >
                  <MapPin className="w-3 h-3" />
                  DigiPIN
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="px-6 pb-4 pt-2">
          <div className="grid grid-cols-4 gap-3">
            {kpiData.map((kpi, idx) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{
                  y: -2,
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
                className="p-3 rounded-xl border relative overflow-hidden group cursor-pointer"
                style={{
                  background: idx === 0
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : idx === 1
                      ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                      : idx === 2
                        ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                        : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderWidth: '1px',
                  boxShadow: `
                    0 6px 16px -4px rgba(0, 0, 0, 0.2),
                    0 2px 4px -1px rgba(0, 0, 0, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                  `,
                  backdropFilter: 'blur(10px)'
                }}
              >
                {/* Matte overlay */}
                <div
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.2) 100%)'
                  }}
                />

                {/* Glossy shimmer */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                    backgroundSize: '200% 200%'
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />

                <div className="relative z-10 flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(255, 255, 255, 0.25)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <kpi.icon className="w-5 h-5 text-white drop-shadow-lg" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xl font-black text-white drop-shadow-lg leading-tight"
                      style={{
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.5)',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {kpi.value}
                    </p>
                    <p
                      className="text-xs font-bold text-white opacity-90 truncate"
                      style={{
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {kpi.label}
                    </p>
                  </div>

                  {kpi.change && (
                    <Badge
                      className="text-xs px-2 py-0.5 font-black flex-shrink-0"
                      style={{
                        background: kpi.trend === 'up'
                          ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.95) 0%, rgba(245, 158, 11, 0.95) 100%)'
                          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {kpi.change}
                    </Badge>
                  )}
                </div>

                {/* Bottom highlight */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)'
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-y-auto">
        {/* Left Sidebar - Glossy Filters & Layers (280px) */}
        <AnimatePresence>
          {showLeftSidebar && (
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 border-r flex flex-col relative"
              style={{
                background: 'linear-gradient(135deg, rgba(247, 249, 252, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                borderColor: theme.border,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
              }}
            >
              {/* Glossy overlay effect */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.3) 100%)',
                  opacity: 0.5
                }}
              />

              {/* Sidebar Content (Scrollable) */}
              <div className="flex-1 flex flex-col relative z-10 overflow-y-auto custom-scrollbar">

                {/* Header with Close Button */}
                {/* Header with Close Button */}
                <div className="flex flex-col mx-4 mt-4 mb-2 shrink-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wide" style={{ color: theme.textPrimary }}>
                      Map Layers
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowLeftSidebar(false)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                        border: '2px solid rgba(239, 68, 68, 0.2)',
                        color: theme.danger,
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)'
                      }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {(() => {
                    const filteredLayers = getFilteredLayers();
                    const allChecked = filteredLayers.length > 0 && filteredLayers.every(layer => qgisLayers[layer.id]);
                    const someChecked = filteredLayers.some(layer => qgisLayers[layer.id]);

                    return (
                      <div className="space-y-3">
                        {/* All Layers Toggle (Moved to Header) */}
                        <div className="flex items-center justify-between p-3 rounded-lg border" style={{
                          background: allChecked ? 'rgba(59, 130, 246, 0.1)' : theme.panelBg,
                          borderColor: allChecked ? theme.primary : theme.border
                        }}>
                          <label className="flex items-center gap-2 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={allChecked}
                              onChange={(e) => {
                                const newValue = e.target.checked;
                                if (selectedPropertyTypeFilter) {
                                  // If unchecking the "All Layers" box for a filtered view, RESET to "All Properties"
                                  if (!newValue) {
                                    togglePropertyTypeFilter(null);
                                  } else {
                                    toggleAllLayersForPropertyType(selectedPropertyTypeFilter, newValue);
                                  }
                                } else {
                                  const updates: Record<string, boolean> = {};
                                  const bulkUpdates: { id: string, visible: boolean }[] = [];

                                  filteredLayers.forEach(layer => {
                                    if (forcedOnLayers.has(layer.id)) {
                                      updates[layer.id] = true;
                                      bulkUpdates.push({ id: layer.id, visible: true });
                                      return;
                                    }
                                    updates[layer.id] = newValue;
                                    bulkUpdates.push({ id: layer.id, visible: newValue });
                                  });

                                  setQgisLayers(prev => ({ ...prev, ...updates }));
                                  sendLayerVisibilityUpdateMessage(bulkUpdates);
                                }
                              }}
                              className="w-4 h-4 rounded"
                              style={{
                                accentColor: theme.primary,
                                ...(someChecked && !allChecked ? { opacity: 0.7 } : {})
                              }}
                              ref={(el: HTMLInputElement | null) => {
                                if (el) {
                                  el.indeterminate = someChecked && !allChecked;
                                }
                              }}
                            />
                            <span className="text-sm font-bold" style={{ color: theme.textPrimary }}>
                              {selectedPropertyTypeFilter
                                ? `${propertyTypeOptions.find(t => t.id === selectedPropertyTypeFilter)?.label} Layers`
                                : 'All Layers'}
                            </span>
                          </label>
                          <Badge className="text-xs px-2 py-0.5" style={{
                            background: theme.primary,
                            color: 'white',
                            border: 'none'
                          }}>
                            {filteredLayers.filter(l => qgisLayers[l.id]).length} / {filteredLayers.length}
                          </Badge>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Filtered QGIS Map Layers (Scrollable List) */}
                <div className="flex-1 overflow-y-auto p-4 pt-1 pb-60 space-y-4 custom-scrollbar">
                  {(() => {
                    const filteredLayers = getFilteredLayers();
                    return (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          {filteredLayers.map((layer) => (
                            <label
                              key={layer.id}
                              className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
                              style={{
                                background: qgisLayers[layer.id] ? 'rgba(59, 130, 246, 0.05)' : 'white',
                                border: qgisLayers[layer.id] ? `1px solid ${theme.primary}40` : `1px solid ${theme.border}`
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={forcedOnLayers.has(layer.id) ? true : (qgisLayers[layer.id] || false)}
                                onChange={() => toggleQgisLayer(layer.id)}
                                disabled={forcedOnLayers.has(layer.id)}
                                className="w-5 h-5 rounded"
                                style={{ accentColor: theme.primary, cursor: forcedOnLayers.has(layer.id) ? 'not-allowed' : 'pointer' }}
                              />
                              <div
                                className="w-4 h-4 rounded-sm flex-shrink-0 shadow-sm"
                                style={{
                                  background: layer.color,
                                  opacity: qgisLayers[layer.id] ? 1 : 0.6,
                                  border: '1px solid rgba(0,0,0,0.1)'
                                }}
                              />
                              <span
                                className="text-sm flex-1 truncate font-medium"
                                style={{
                                  color: qgisLayers[layer.id] ? theme.textPrimary : theme.textSecondary,
                                }}
                                title={layer.name}
                              >
                                {layer.name}
                              </span>
                            </label>
                          ))}
                        </div>

                        {/* Property Type Dropdown Removed per user request */}
                      </div>
                    );
                  })()}
                </div>

              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Toggle Left Sidebar Button (when hidden) */}
        {!showLeftSidebar && (
          <motion.button
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLeftSidebar(true)}
            className="absolute top-1/2 left-6 -translate-y-1/2 z-30 w-10 h-20 rounded-r-xl flex items-center justify-center"
            style={{
              background: theme.primary,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
            }}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>
        )}

        {/* Central Map Panel */}
        <div className="flex-1 relative overflow-hidden" style={{ position: 'relative' }}>
          <QGISMapView ref={mapIframeRef} mapFolder="qgis2web_2025_12_08-16_09_36_742787" />

          {/* Map Overlay Controls - Top Right */}


          {/* Legend - Bottom Left */}


          {/* Quick Stats Breadcrumb - Top Left */}

        </div>

        {/* Right Analytics Panel (360px) - Kept as is */}
        <AnimatePresence>
          {showAnalytics && (
            <motion.aside
              initial={{ x: 360 }}
              animate={{ x: 0 }}
              exit={{ x: 360 }}
              className="w-90 border-l flex flex-col overflow-hidden"
              style={{
                background: theme.panelBg,
                borderColor: theme.border
              }}
            >
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border }}>
                <h2 className="text-sm font-bold" style={{ color: theme.textPrimary }}>Analytics</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnalytics(false)}
                  className="w-7 h-7 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Quick Actions & Live Activity */}
                <div className="space-y-3">
                  {/* Quick Actions Panel */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.95) 100%)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      boxShadow: `
                        0 8px 32px rgba(59, 130, 246, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.8),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.05)
                      `
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4" style={{ color: theme.primary }} />
                      <h4 className="text-xs font-bold" style={{ color: theme.textPrimary }}>Quick Actions</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: Search, label: 'Find Property', color: '#3b82f6' },
                        { icon: MapPinned, label: 'Add Marker', color: '#8b5cf6' },
                        { icon: Download, label: 'Export Map', color: '#10b981' },
                        { icon: Target, label: 'Measure', color: '#f59e0b' }
                      ].map((action, idx) => (
                        <motion.button
                          key={action.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2.5 rounded-lg flex items-center gap-2 group relative overflow-hidden"
                          style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
                          }}
                        >
                          <div
                            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}dd 100%)`,
                              boxShadow: `0 2px 8px ${action.color}40`
                            }}
                          >
                            <action.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-semibold truncate" style={{ color: theme.textSecondary }}>
                            {action.label}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Live Activity Feed */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-xl relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: `
                        0 8px 24px rgba(0, 0, 0, 0.08),
                        inset 0 1px 0 rgba(255, 255, 255, 0.9),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.05)
                      `
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" style={{ color: theme.primary }} />
                        <h4 className="text-xs font-bold" style={{ color: theme.textPrimary }}>Live Activity</h4>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full"
                        style={{ background: '#10b981', boxShadow: '0 0 8px #10b981' }}
                      />
                    </div>

                    <div className="space-y-2.5 max-h-32 overflow-y-auto custom-scrollbar">
                      {[
                        { icon: CheckCircle2, text: 'Property #4521 verified', time: '2m ago', color: '#10b981' },
                        { icon: MapPin, text: 'New marker added in Zone-A', time: '5m ago', color: '#3b82f6' },
                        { icon: AlertTriangle, text: '3 properties pending review', time: '12m ago', color: '#f59e0b' },
                        { icon: Download, text: 'Map data exported', time: '18m ago', color: '#8b5cf6' }
                      ].map((activity, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-2.5 p-2 rounded-lg group hover:bg-white/60 transition-colors"
                        >
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                            style={{
                              background: `${activity.color}15`,
                              border: `1px solid ${activity.color}30`
                            }}
                          >
                            <activity.icon className="w-3.5 h-3.5" style={{ color: activity.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate" style={{ color: theme.textPrimary }}>
                              {activity.text}
                            </p>
                            <p className="text-[10px]" style={{ color: theme.textTertiary }}>
                              {activity.time}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Tax Collection Trend */}
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    background: theme.cardBg,
                    borderColor: theme.border,
                    boxShadow: theme.shadow
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold" style={{ color: theme.textPrimary }}>
                      Tax Collection Trend
                    </h3>
                    <LineChart className="w-4 h-4" style={{ color: theme.textSecondary }} />
                  </div>
                  <div className="h-32 flex items-end justify-between gap-1">
                    {[65, 72, 68, 78, 82, 75, 85, 88, 92, 89, 95, 98].map((val, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ height: 0 }}
                        animate={{ height: `${val}%` }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        className="flex-1 rounded-t"
                        style={{ background: `linear-gradient(to top, ${theme.primary}, ${theme.primaryLight})` }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs" style={{ color: theme.textSecondary }}>
                    <span>Jan</span>
                    <span>Dec</span>
                  </div>
                </div>

                {/* Pending Dues Breakdown */}
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    background: theme.cardBg,
                    borderColor: theme.border,
                    boxShadow: theme.shadow
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold" style={{ color: theme.textPrimary }}>
                      Pending Dues by Ward
                    </h3>
                    <PieChart className="w-4 h-4" style={{ color: theme.textSecondary }} />
                  </div>
                  <div className="space-y-2">
                    {[
                      { ward: 'Ward 1', amount: 2.4, percent: 25, color: theme.primary },
                      { ward: 'Ward 2', amount: 1.8, percent: 18, color: theme.secondary },
                      { ward: 'Ward 3', amount: 3.2, percent: 32, color: theme.warning },
                      { ward: 'Ward 4', amount: 2.5, percent: 25, color: theme.danger }
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-1 text-xs">
                          <span style={{ color: theme.textPrimary }}>{item.ward}</span>
                          <span className="font-bold" style={{ color: theme.textPrimary }}>₹{item.amount}Cr ({item.percent}%)</span>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: theme.borderLight }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ background: item.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Land Use vs Revenue */}
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    background: theme.cardBg,
                    borderColor: theme.border,
                    boxShadow: theme.shadow
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold" style={{ color: theme.textPrimary }}>
                      Revenue by Type
                    </h3>
                    <BarChart3 className="w-4 h-4" style={{ color: theme.textSecondary }} />
                  </div>
                  <div className="space-y-3">
                    {[
                      { type: 'Residential', amount: 45.2, color: theme.success },
                      { type: 'Commercial', amount: 32.8, color: theme.primary },
                      { type: 'Industrial', amount: 15.4, color: theme.warning },
                      { type: 'Institutional', amount: 6.6, color: theme.secondary }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-20 text-xs font-bold" style={{ color: theme.textSecondary }}>
                          {item.type}
                        </div>
                        <div className="flex-1 h-2.5 rounded-full" style={{ background: theme.borderLight }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.amount}%` }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ background: item.color }}
                          />
                        </div>
                        <span className="text-xs font-bold w-12 text-right" style={{ color: theme.textPrimary }}>
                          {item.amount}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Property Detail Panel - Slides in from right */}
        <AnimatePresence>
          {/* Property Detail Popup - Centered Modal */}
          {showPropertyDetail && selectedProperty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
              onClick={() => setShowPropertyDetail(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-[450px] max-h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl relative"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                }}
              >
                {/* Header */}
                <div
                  className="px-6 py-4 border-b relative shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  }}
                >
                  {/* Back Button - Top Left Corner */}
                  <motion.button
                    whileHover={{ scale: 1.05, x: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPropertyDetail(false)}
                    className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </motion.button>

                  <div className="relative z-10 flex items-start justify-between mt-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-white" />
                        <h3 className="text-white font-bold">Property Details</h3>
                      </div>
                      <p className="text-sm text-blue-100 font-medium">
                        {selectedProperty.propertyNo}
                      </p>
                      <Badge
                        className="mt-2"
                        style={{
                          background: selectedProperty.status === 'Paid'
                            ? '#10b981'
                            : selectedProperty.status === 'Partially Paid'
                              ? '#f59e0b'
                              : '#ef4444',
                          color: 'white',
                          border: 'none'
                        }}
                      >
                        {selectedProperty.status}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => setShowPropertyDetail(false)}
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="h-[calc(100%-120px)] overflow-y-auto custom-scrollbar">
                  <Tabs defaultValue="basic" className="w-full">
                    <div className="sticky top-0 z-10 bg-white border-b px-4 pt-4">
                      <TabsList className="w-full grid grid-cols-4">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="owner">Owner</TabsTrigger>
                        <TabsTrigger value="society">Society</TabsTrigger>
                        <TabsTrigger value="docs">Docs</TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Basic Info Tab */}
                      <TabsContent value="basic" className="mt-0 space-y-3">
                        <PropertyInfoCard title="Property Information" icon={Home} theme={theme}>
                          <PropertyInfoRow label="Property No" value={selectedProperty.propertyNo} />
                          <PropertyInfoRow label="Description" value={selectedProperty.description} />
                          <PropertyInfoRow label="Division" value={selectedProperty.division} />
                          <PropertyInfoRow label="Block No" value={selectedProperty.blockNo} />
                          <PropertyInfoRow label="Plot No" value={selectedProperty.plotNo} />
                          <PropertyInfoRow label="Plot Area" value={`${selectedProperty.plotArea} sq.ft`} />
                          <PropertyInfoRow label="Survey No" value={selectedProperty.surveyNo} />
                          <PropertyInfoRow label="UPIC ID" value={selectedProperty.upicId} />
                          <PropertyInfoRow label="Tax Zone" value={selectedProperty.taxZone} />
                          <PropertyInfoRow label="Sub-zone" value={selectedProperty.subZone} />
                          <PropertyInfoRow label="Carpet Area" value={`${selectedProperty.carpetArea} sq.ft`} />
                          <PropertyInfoRow label="Built-up Area" value={`${selectedProperty.builtUpArea} sq.ft`} />
                        </PropertyInfoCard>

                        {selectedProperty.isAssessed !== undefined && (
                          <PropertyInfoCard title="Assessment Status" icon={FileCheck} theme={theme}>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                              {selectedProperty.isAssessed ? (
                                <>
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                  <div>
                                    <p className="font-semibold text-sm text-gray-900">Assessed</p>
                                    <p className="text-xs text-gray-600">New map matches old map</p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-5 h-5 text-orange-600" />
                                  <div>
                                    <p className="font-semibold text-sm text-gray-900">Unassessed</p>
                                    <p className="text-xs text-gray-600">New property or mismatch detected</p>
                                  </div>
                                </>
                              )}
                            </div>
                          </PropertyInfoCard>
                        )}
                      </TabsContent>

                      {/* Owner Info Tab */}
                      <TabsContent value="owner" className="mt-0 space-y-3">
                        <PropertyInfoCard title="Owner Details" icon={User} theme={theme}>
                          <PropertyInfoRow label="Owner Type" value={selectedProperty.ownerType} />
                          <PropertyInfoRow label="Title" value={selectedProperty.ownerTitle} />
                          <PropertyInfoRow label="Holder Name" value={selectedProperty.holderName} />
                          <PropertyInfoRow label="Occupier Name" value={selectedProperty.occupierName} />
                          <PropertyInfoRow label="Shop Name" value={selectedProperty.shopName} />
                        </PropertyInfoCard>

                        <PropertyInfoCard title="Contact Information" icon={Phone} theme={theme}>
                          <PropertyInfoRow label="Address" value={selectedProperty.address} />
                          <PropertyInfoRow label="Wing" value={selectedProperty.wing} />
                          <PropertyInfoRow label="Flat No" value={selectedProperty.flatNo} />
                          <PropertyInfoRow label="Landmark" value={selectedProperty.landmark} />
                          <PropertyInfoRow label="Pincode" value={selectedProperty.pincode} />
                          <PropertyInfoRow label="DigiPIN" value={selectedProperty.digiPin} icon={MapPin} highlight />
                          <PropertyInfoRow label="Mobile No" value={selectedProperty.mobile} icon={Phone} />
                          <PropertyInfoRow label="Email ID" value={selectedProperty.email} icon={Mail} />
                          <PropertyInfoRow label="Aadhar No" value={`XXXX-XXXX-${selectedProperty.aadharNo.slice(-4)}`} icon={CreditCard} />
                        </PropertyInfoCard>
                      </TabsContent>

                      {/* Society/Building Tab */}
                      <TabsContent value="society" className="mt-0 space-y-3">
                        {selectedProperty.isSociety ? (
                          <>
                            <PropertyInfoCard title="Society Information" icon={Building} theme={theme}>
                              <PropertyInfoRow label="Land Owner" value={selectedProperty.societyData.landOwner} />
                              <PropertyInfoRow label="Builder Name" value={selectedProperty.societyData.builderName} />
                              <PropertyInfoRow label="Society/Building" value={selectedProperty.societyData.societyName} />
                              <PropertyInfoRow label="Secretary Name" value={selectedProperty.societyData.secretaryName} />
                              <PropertyInfoRow label="Secretary Mobile" value={selectedProperty.societyData.secretaryMobile} />
                              <PropertyInfoRow label="Secretary Email" value={selectedProperty.societyData.secretaryEmail} />
                              <PropertyInfoRow label="Society Address" value={selectedProperty.societyData.societyAddress} />
                              <PropertyInfoRow label="Society Email" value={selectedProperty.societyData.societyEmail} />
                            </PropertyInfoCard>

                            <PropertyInfoCard title="Certificates" icon={Award} theme={theme}>
                              <PropertyInfoRow
                                label="Commencement Cert"
                                value={`${selectedProperty.societyData.commencementCertNo} / ${selectedProperty.societyData.commencementCertDate}`}
                              />
                              <PropertyInfoRow
                                label="Occupancy Cert"
                                value={`${selectedProperty.societyData.occupancyCertNo} / ${selectedProperty.societyData.occupancyCertDate}`}
                              />
                              <PropertyInfoRow
                                label="Possession Cert"
                                value={`${selectedProperty.societyData.possessionCertNo} / ${selectedProperty.societyData.possessionCertDate}`}
                              />
                              <PropertyInfoRow
                                label="Index II"
                                value={`${selectedProperty.societyData.indexIINo} / ${selectedProperty.societyData.indexIIDate}`}
                              />
                              <PropertyInfoRow
                                label="Electricity Bill"
                                value={`${selectedProperty.societyData.electricityBillNo} / ${selectedProperty.societyData.electricityBillDate}`}
                              />
                            </PropertyInfoCard>

                            {selectedProperty.societyData.wings && selectedProperty.societyData.wings.length > 0 && (
                              <PropertyInfoCard title="Wings & Properties" icon={Building2} theme={theme}>
                                <div className="space-y-2">
                                  {selectedProperty.societyData.wings.map((wing: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className="p-3 rounded-lg border bg-gray-50"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-sm">Wing {wing.name}</span>
                                        <Badge variant="outline">{wing.properties?.length || 0} Units</Badge>
                                      </div>
                                      <div className="grid grid-cols-2 gap-1">
                                        {wing.properties?.map((prop: any, pIdx: number) => (
                                          <div
                                            key={pIdx}
                                            className="text-xs px-2 py-1 rounded flex items-center gap-1"
                                            style={{
                                              background: prop.isAssessed ? '#dcfce7' : '#fef3c7'
                                            }}
                                          >
                                            <div
                                              className="w-2 h-2 rounded-full"
                                              style={{
                                                background: prop.isAssessed ? '#10b981' : '#f59e0b'
                                              }}
                                            />
                                            {prop.unitNo}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </PropertyInfoCard>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-12">
                            <Building className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-sm text-gray-500">Not part of a society or apartment</p>
                          </div>
                        )}
                      </TabsContent>

                      {/* Documents Tab */}
                      <TabsContent value="docs" className="mt-0 space-y-3">
                        <PropertyInfoCard title="Attached Documents" icon={FileText} theme={theme}>
                          <DocumentItem
                            name="Karaakarani Report"
                            available={selectedProperty.documents?.karaakaraniReport}
                            date="12 Jan 2025"
                          />
                          <DocumentItem
                            name="Notice Bill"
                            available={selectedProperty.documents?.noticeBill}
                            date="15 Jan 2025"
                          />
                          {selectedProperty.status === 'Paid' && (
                            <DocumentItem
                              name="No Due Certificate"
                              available={selectedProperty.documents?.noDueCert}
                              date="20 Jan 2025"
                              badge="Verified"
                            />
                          )}
                        </PropertyInfoCard>

                        {selectedProperty.oldDetails && (
                          <PropertyInfoCard title="Old Property Details" icon={Clock} theme={theme}>
                            <PropertyInfoRow label="Old Property No" value={selectedProperty.oldDetails.propertyNo} />
                            <PropertyInfoRow label="Old Ward" value={selectedProperty.oldDetails.ward} />
                            <PropertyInfoRow label="Old Tax Amount" value={selectedProperty.oldDetails.taxAmount} />
                            <PropertyInfoRow label="Last Updated" value={selectedProperty.oldDetails.lastUpdated} />
                          </PropertyInfoCard>
                        )}
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div >
  );
}

// Helper Components for Property Detail Panel
function PropertyInfoCard({ title, icon: Icon, children, theme }: any) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div
        className="px-4 py-3 border-b flex items-center gap-2"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}
      >
        <Icon className="w-4 h-4 text-blue-600" />
        <h4 className="font-semibold text-sm text-gray-900">{title}</h4>
      </div>
      <div className="p-4 space-y-2.5">
        {children}
      </div>
    </div>
  );
}

function PropertyInfoRow({ label, value, icon: Icon, highlight = false }: any) {
  return (
    <div className="flex items-start justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
        <span className="text-gray-600 font-medium">{label}:</span>
      </div>
      <span
        className={`font-semibold text-right max-w-[200px] truncate ${highlight ? 'text-blue-600' : 'text-gray-900'}`}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

function DocumentItem({ name, available, date, badge }: any) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg border group hover:border-blue-300 transition-colors"
      style={{
        background: available ? '#f0f9ff' : '#fef2f2',
        borderColor: available ? '#bfdbfe' : '#fecaca'
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            background: available ? '#dbeafe' : '#fee2e2'
          }}
        >
          <FileText className="w-5 h-5" style={{ color: available ? '#3b82f6' : '#ef4444' }} />
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      {available ? (
        <div className="flex items-center gap-2">
          {badge && (
            <Badge className="bg-green-100 text-green-700 border-green-300">
              {badge}
            </Badge>
          )}
          <Button size="sm" variant="ghost" className="group-hover:bg-blue-100">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Badge variant="outline" className="text-red-600 border-red-300">
          Not Available
        </Badge>
      )}
    </div>
  );
}
