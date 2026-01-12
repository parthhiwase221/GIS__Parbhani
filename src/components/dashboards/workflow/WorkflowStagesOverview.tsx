import { Building2, MapPin, TrendingUp, FileText, CheckCircle2, Send, ThumbsUp, Bell, Receipt, Home, ImageIcon, Search, Download, FileSpreadsheet } from "lucide-react";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { WorkflowStage } from "./types";
import { useState } from "react";
import { WardWiseSummary } from "./WardWiseSummary";

interface StageCardData {
  stage: WorkflowStage;
  count: number;
  icon: React.ReactNode;
  gradient: string;
  borderColor: string;
}

interface WorkflowStagesOverviewProps {
  onStageClick: (stage: WorkflowStage) => void;
}

export function WorkflowStagesOverview({ onStageClick }: WorkflowStagesOverviewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStageForSummary, setSelectedStageForSummary] = useState<WorkflowStage>("Geo-sequencing");
  const [selectedDivision, setSelectedDivision] = useState<{ id: number; name: string } | null>(null);

  const stages: StageCardData[] = [
    {
      stage: "Geo-sequencing",
      count: 23,
      icon: <MapPin className="w-3.5 h-3.5" />,
      gradient: "from-indigo-500 to-purple-600",
      borderColor: "border-indigo-300"
    },
    {
      stage: "Internal Survey",
      count: 24,
      icon: <Building2 className="w-3.5 h-3.5" />,
      gradient: "from-purple-500 to-pink-600",
      borderColor: "border-purple-300"
    },
    {
      stage: "Data Processing",
      count: 20,
      icon: <FileText className="w-3.5 h-3.5" />,
      gradient: "from-cyan-500 to-blue-600",
      borderColor: "border-cyan-300"
    },
    {
      stage: "Quality Analyst",
      count: 20,
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      gradient: "from-green-500 to-emerald-600",
      borderColor: "border-green-300"
    },
    {
      stage: "Forward to ULB",
      count: 16,
      icon: <Send className="w-3.5 h-3.5" />,
      gradient: "from-pink-500 to-rose-600",
      borderColor: "border-pink-300"
    },
    {
      stage: "Approved by ULB",
      count: 16,
      icon: <ThumbsUp className="w-3.5 h-3.5" />,
      gradient: "from-teal-500 to-cyan-600",
      borderColor: "border-teal-300"
    },
    {
      stage: "Notice Distribution",
      count: 16,
      icon: <Bell className="w-3.5 h-3.5" />,
      gradient: "from-orange-500 to-amber-600",
      borderColor: "border-orange-300"
    },
    {
      stage: "Bills Distribution",
      count: 16,
      icon: <Receipt className="w-3.5 h-3.5" />,
      gradient: "from-red-500 to-rose-600",
      borderColor: "border-red-300"
    }
  ];

  // Get data based on selected stage
  const getDivisionDataForStage = (stage: WorkflowStage) => {
    // Different data for each stage
    const stageMultipliers: Record<WorkflowStage, number> = {
      "Geo-sequencing": 1.0,
      "Internal Survey": 0.95,
      "Data Processing": 0.90,
      "Quality Analyst": 0.85,
      "Forward to ULB": 0.80,
      "Approved by ULB": 0.75,
      "Notice Distribution": 0.70,
      "Bills Distribution": 0.65,
    };
    
    const multiplier = stageMultipliers[stage] || 1.0;
    
    return [
      {
        id: 1,
        name: "Zone 1 - Central",
        registered: 2150,
        buildings: Math.floor(2856 * multiplier),
        properties: Math.floor(4407 * multiplier),
        residential: Math.floor(2734 * multiplier),
        nonResidential: Math.floor(898 * multiplier),
        mixed: Math.floor(456 * multiplier),
        openPlots: Math.floor(299 * multiplier),
        assessed: Math.floor(3628 * multiplier),
        unassessed: Math.floor(759 * multiplier),
        photos: Math.floor(4125 * multiplier),
        plans: Math.floor(31 * multiplier)
      },
      {
        id: 2,
        name: "Zone 2 - East",
        registered: 2540,
        buildings: Math.floor(3245 * multiplier),
        properties: Math.floor(5167 * multiplier),
        residential: Math.floor(3423 * multiplier),
        nonResidential: Math.floor(1078 * multiplier),
        mixed: Math.floor(489 * multiplier),
        openPlots: Math.floor(177 * multiplier),
        assessed: Math.floor(4389 * multiplier),
        unassessed: Math.floor(778 * multiplier),
        photos: Math.floor(4832 * multiplier),
        plans: Math.floor(42 * multiplier)
      },
      {
        id: 3,
        name: "Zone 3 - West",
        registered: 1850,
        buildings: Math.floor(2189 * multiplier),
        properties: Math.floor(3623 * multiplier),
        residential: Math.floor(2312 * multiplier),
        nonResidential: Math.floor(789 * multiplier),
        mixed: Math.floor(334 * multiplier),
        openPlots: Math.floor(188 * multiplier),
        assessed: Math.floor(2945 * multiplier),
        unassessed: Math.floor(678 * multiplier),
        photos: Math.floor(3234 * multiplier),
        plans: Math.floor(28 * multiplier)
      },
      {
        id: 4,
        name: "Zone 4 - North",
        registered: 3100,
        buildings: Math.floor(3634 * multiplier),
        properties: Math.floor(5834 * multiplier),
        residential: Math.floor(3756 * multiplier),
        nonResidential: Math.floor(1245 * multiplier),
        mixed: Math.floor(613 * multiplier),
        openPlots: Math.floor(220 * multiplier),
        assessed: Math.floor(4923 * multiplier),
        unassessed: Math.floor(911 * multiplier),
        photos: Math.floor(5389 * multiplier),
        plans: Math.floor(51 * multiplier)
      },
      {
        id: 5,
        name: "Zone 5 - South",
        registered: 2360,
        buildings: Math.floor(2867 * multiplier),
        properties: Math.floor(4456 * multiplier),
        residential: Math.floor(2845 * multiplier),
        nonResidential: Math.floor(956 * multiplier),
        mixed: Math.floor(478 * multiplier),
        openPlots: Math.floor(177 * multiplier),
        assessed: Math.floor(3701 * multiplier),
        unassessed: Math.floor(755 * multiplier),
        photos: Math.floor(4134 * multiplier),
        plans: Math.floor(38 * multiplier)
      }
    ];
  };

  const divisionData = getDivisionDataForStage(selectedStageForSummary);

  // Filter divisions based on search query
  const filteredDivisions = divisionData.filter(division =>
    division.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals
  const totals = {
    registered: filteredDivisions.reduce((sum, d) => sum + d.registered, 0),
    buildings: filteredDivisions.reduce((sum, d) => sum + d.buildings, 0),
    properties: filteredDivisions.reduce((sum, d) => sum + d.properties, 0),
    residential: filteredDivisions.reduce((sum, d) => sum + d.residential, 0),
    nonResidential: filteredDivisions.reduce((sum, d) => sum + d.nonResidential, 0),
    mixed: filteredDivisions.reduce((sum, d) => sum + d.mixed, 0),
    openPlots: filteredDivisions.reduce((sum, d) => sum + d.openPlots, 0),
    assessed: filteredDivisions.reduce((sum, d) => sum + d.assessed, 0),
    unassessed: filteredDivisions.reduce((sum, d) => sum + d.unassessed, 0),
    photos: filteredDivisions.reduce((sum, d) => sum + d.photos, 0),
    plans: filteredDivisions.reduce((sum, d) => sum + d.plans, 0)
  };

  const handleExport = () => {
    console.log("Exporting data...");
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-auto">
      <div className="max-w-full mx-auto px-3 py-2">
        {/* Header - Compact */}
        <div className="mb-2">
          <h1 className="text-lg font-bold text-gray-800 leading-tight">
            Property Tax Data Center and Dashboard
          </h1>
          <p className="text-[10px] text-gray-600">Workflow management and property tracking</p>
        </div>

        {/* Summary Stats - Professional Enhanced with Color Shadows */}
        <div className="grid grid-cols-3 gap-3 mb-2">
          {/* Total Properties & Assessment Overview */}
          <Card 
            className="relative overflow-hidden border-0 bg-white p-4 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] group cursor-pointer"
            style={{
              boxShadow: '0 8px 32px rgba(168, 85, 247, 0.3), 0 4px 16px rgba(236, 72, 153, 0.2)',
              background: 'linear-gradient(135deg, #faf5ff 0%, #fff1f2 100%)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(168, 85, 247, 0.4), 0 8px 24px rgba(236, 72, 153, 0.3)';
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(168, 85, 247, 0.3), 0 4px 16px rgba(236, 72, 153, 0.2)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            {/* Animated gradient border top */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 via-pink-500 to-purple-500 animate-pulse"></div>
            
            {/* Decorative corner elements */}
            <div className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-2 left-2 w-16 h-16 bg-gradient-to-tr from-fuchsia-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
            
            {/* Content wrapper */}
            <div className="relative flex items-center justify-between">
              <div className="flex-1 pr-4">
                {/* Title with gradient */}
                <div className="mb-3">
                  <p className="text-xs font-bold mb-1 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider">
                    Total Properties Assessment
                  </p>
                  <div className="h-0.5 w-24 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-full"></div>
                </div>
                
                {/* Metrics grid */}
                <div className="space-y-2.5">
                  {/* Properties count */}
                  <div className="flex items-baseline gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-purple-700 font-medium">Properties:</span>
                    </div>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-700 to-fuchsia-700 bg-clip-text text-transparent">
                      54,450
                    </span>
                  </div>
                  
                  {/* Total Demand */}
                  <div className="flex items-baseline gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-[10px] text-fuchsia-700 font-medium">Total Demand:</span>
                    </div>
                    <span className="text-xl font-extrabold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                      ₹24.8Cr
                    </span>
                  </div>
                  
                  {/* Comparison badge */}
                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2.5 py-1 rounded-full shadow-md">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[10px] font-bold">+12.5% vs Last Month</span>
                  </div>
                </div>
              </div>
              
              {/* Animated icon section */}
              <div className="relative flex-shrink-0">
                {/* Pulsing background circles */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-400 to-purple-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" style={{ animationDelay: '0.5s' }}></div>
                
                {/* Icon container with glow */}
                <div 
                  className="relative p-4 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl"
                  style={{
                    boxShadow: '0 8px 32px rgba(168, 85, 247, 0.5), 0 4px 16px rgba(236, 72, 153, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Building2 className="w-8 h-8 text-white drop-shadow-lg" />
                  
                  {/* Sparkle effect */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
          </Card>

          {/* Assessment Approved */}
          <Card 
            className="relative overflow-hidden border-2 border-green-200 bg-white p-3 transition-all duration-300 hover:-translate-y-1 group"
            style={{
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25), 0 2px 4px rgba(16, 185, 129, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.35), 0 6px 12px rgba(16, 185, 129, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.25), 0 2px 4px rgba(16, 185, 129, 0.15)';
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/70 via-transparent to-emerald-50/50 opacity-60"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <p className="text-[10px] text-green-700 font-semibold mb-1 leading-tight uppercase tracking-wide">
                  Assessment Approved
                </p>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-2xl font-bold text-green-900">16</span>
                  <span className="text-sm font-semibold text-green-700">₹97.63L</span>
                </div>
                <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-sm shadow-green-300"></div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div 
                  className="relative p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300"
                  style={{
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4), 0 2px 6px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          {/* Revenue Increased */}
          <Card 
            className="relative overflow-hidden border-2 border-blue-200 bg-white p-3 transition-all duration-300 hover:-translate-y-1 group"
            style={{
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25), 0 2px 4px rgba(59, 130, 246, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(59, 130, 246, 0.35), 0 6px 12px rgba(59, 130, 246, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.25), 0 2px 4px rgba(59, 130, 246, 0.15)';
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/70 via-transparent to-blue-50/50 opacity-60"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <p className="text-[10px] text-blue-700 font-semibold mb-1 leading-tight uppercase tracking-wide">
                  Revenue Increased
                </p>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-2xl font-bold text-blue-900">16</span>
                  <span className="text-sm font-semibold text-blue-700">₹10.13L</span>
                  <span className="text-sm font-bold text-green-600">+11.58%</span>
                </div>
                <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-sm shadow-blue-300"></div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div 
                  className="relative p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300"
                  style={{
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4), 0 2px 6px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Workflow Stage Cards - Compact */}
        <div className="grid grid-cols-8 gap-2 mb-2">
          {stages.map((stageData) => (
            <Card
              key={stageData.stage}
              className={`${stageData.borderColor} border hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-0.5 ${selectedStageForSummary === stageData.stage ? 'ring-2 ring-blue-400 shadow-md' : ''}`}
              onClick={() => {
                setSelectedStageForSummary(stageData.stage);
              }}
            >
              <div className="p-2">
                {/* Icon and Count */}
                <div className="flex items-center justify-between mb-1">
                  <div className={`p-1.5 rounded bg-gradient-to-br ${stageData.gradient} text-white`}>
                    {stageData.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800 group-hover:scale-105 transition-transform">
                      {stageData.count}
                    </div>
                  </div>
                </div>

                {/* Stage Name */}
                <div>
                  <h3 className="text-[9px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">
                    {stageData.stage}
                  </h3>
                </div>

                {/* Progress Indicator */}
                <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stageData.gradient} transition-all duration-500 group-hover:w-full`}
                    style={{ width: `${(stageData.count / 24) * 100}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Division Summary Section OR Ward-wise Summary - Updates based on selected stage */}
        {selectedDivision ? (
          <WardWiseSummary
            divisionId={selectedDivision.id}
            divisionName={selectedDivision.name}
            selectedStage={selectedStageForSummary}
            onBack={() => {
              console.log("onBack called - setting selectedDivision to null");
              setSelectedDivision(null);
            }}
          />
        ) : (
        <div className="bg-white border border-indigo-200 rounded shadow-sm p-2">
          {/* Section Header - Compact */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className={`p-1 bg-gradient-to-br ${stages.find(s => s.stage === selectedStageForSummary)?.gradient || 'from-indigo-500 to-purple-600'} rounded text-white`}>
                {stages.find(s => s.stage === selectedStageForSummary)?.icon || <MapPin className="w-3.5 h-3.5" />}
              </div>
              <div>
                <h2 className="text-xs font-bold text-gray-800 leading-tight">
                  {selectedStageForSummary} - Division wise Summary
                </h2>
                <p className="text-[8px] text-gray-600">विभागीय कार्यालयनिहाय संपत्ती माहिती</p>
              </div>
            </div>
            
            {/* Search and Export - Compact */}
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search divisions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-6 text-[9px] pl-6 pr-2 w-32"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-6 gap-1 text-[9px] px-2">
                    <Download className="h-3 w-3" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExport} className="gap-1.5 text-[10px]">
                    <FileSpreadsheet className="h-3 w-3 text-green-600" />
                    <span>Export to Excel</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExport} className="gap-1.5 text-[10px]">
                    <FileText className="h-3 w-3 text-red-600" />
                    <span>Export to PDF</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Summary Cards - Compact */}
          <div className="grid grid-cols-5 gap-1.5 mb-2">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 p-1.5">
              <div className="text-center">
                <p className="text-[8px] text-blue-700 font-medium mb-0.5 leading-tight">Total Buildings</p>
                <p className="text-sm font-bold text-blue-900">{totals.buildings.toLocaleString()}</p>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 p-1.5">
              <div className="text-center">
                <p className="text-[8px] text-purple-700 font-medium mb-0.5 leading-tight">Total Properties</p>
                <p className="text-sm font-bold text-purple-900">{totals.properties.toLocaleString()}</p>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-1.5">
              <div className="text-center">
                <p className="text-[8px] text-green-700 font-medium mb-0.5 leading-tight">Assessed</p>
                <p className="text-sm font-bold text-green-900">{totals.assessed.toLocaleString()}</p>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 p-1.5">
              <div className="text-center">
                <p className="text-[8px] text-orange-700 font-medium mb-0.5 leading-tight">Unassessed</p>
                <p className="text-sm font-bold text-orange-900">{totals.unassessed.toLocaleString()}</p>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 p-1.5">
              <div className="text-center">
                <p className="text-[8px] text-cyan-700 font-medium mb-0.5 leading-tight">Photos / Plans</p>
                <p className="text-sm font-bold text-cyan-900">{totals.photos.toLocaleString()} / {totals.plans}</p>
              </div>
            </Card>
          </div>

          {/* Data Table */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-100 to-slate-200">
                    <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-12">Sr.</th>
                    <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 min-w-[140px]">Divisional Office</th>
                    <th colSpan={2} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 bg-blue-50">
                      Registered Properties
                    </th>
                    <th colSpan={2} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 bg-purple-50">
                      {selectedStageForSummary} Properties
                    </th>
                    <th colSpan={4} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 bg-green-50">
                      Property Type
                    </th>
                    <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 bg-orange-50">Assessed Properties</th>
                    <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 bg-red-50">Unassessed Properties</th>
                    <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 bg-cyan-50">Photo Count</th>
                  </tr>
                  <tr className="bg-slate-50">
                    <th className="border border-gray-300 px-2 py-1.5 text-center font-medium text-gray-600 text-[10px] bg-blue-50">Buildings</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-center font-medium text-gray-600 text-[10px] bg-blue-50">Properties</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-center font-medium text-gray-600 text-[10px] bg-purple-50">Buildings</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-center font-medium text-gray-600 text-[10px] bg-purple-50">Properties</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-center font-medium text-gray-600 text-[10px] bg-green-50">🏠 Residential</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-center font-medium text-gray-600 text-[10px] bg-green-50">🏢 Non-Residential</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-center font-medium text-gray-600 text-[10px] bg-green-50">🏘️ Mixed</th>
                    <th className="border border-gray-300 px-2 py-1.5 text-center font-medium text-gray-600 text-[10px] bg-green-50">📐 Open Plots</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDivisions.map((division) => (
                    <tr 
                      key={division.id} 
                      className="hover:bg-indigo-50 transition-colors cursor-pointer"
                      onClick={() => {
                        console.log("Division clicked:", division.id, division.name);
                        setSelectedDivision({ id: division.id, name: division.name });
                      }}
                    >
                      <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">{division.id}</td>
                      <td className="border border-gray-300 px-3 py-2 text-left">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300 hover:bg-indigo-100">
                            {division.name}
                          </Badge>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-blue-700">{division.registered.toLocaleString()}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-blue-700">{division.registered.toLocaleString()}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-purple-700">{division.buildings.toLocaleString()}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-purple-700">{division.properties.toLocaleString()}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">{division.residential.toLocaleString()}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">{division.nonResidential.toLocaleString()}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">{division.mixed.toLocaleString()}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">{division.openPlots.toLocaleString()}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-green-700">{division.assessed.toLocaleString()}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-orange-700">{division.unassessed.toLocaleString()}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-cyan-700">{division.photos.toLocaleString()}</td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-gradient-to-r from-slate-100 to-slate-200 font-bold">
                    <td colSpan={2} className="border border-gray-300 px-3 py-2 text-center text-gray-800">Total</td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-blue-800">{totals.registered.toLocaleString()}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-blue-800">{totals.registered.toLocaleString()}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-purple-800">{totals.buildings.toLocaleString()}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-purple-800">{totals.properties.toLocaleString()}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">{totals.residential.toLocaleString()}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">{totals.nonResidential.toLocaleString()}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">{totals.mixed.toLocaleString()}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-gray-800">{totals.openPlots.toLocaleString()}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-green-800">{totals.assessed.toLocaleString()}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-orange-800">{totals.unassessed.toLocaleString()}</td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-cyan-800">{totals.photos.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
