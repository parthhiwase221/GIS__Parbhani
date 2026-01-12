import { useState } from "react";
import { Download, MapPin, Building2, Home, Search, Send, ChevronRight, ChevronDown, FileSpreadsheet, FileText, X, FileCheck2, ImageIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Checkbox } from "../../ui/checkbox";
import { Badge } from "../../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { WorkflowStage } from "./types";
import { generateMockProperties } from "./mockData";
import { exportToExcel, exportToPDF } from "./exportUtils";
import { toast } from "sonner@2.0.3";
import { PropertyListTable } from "./PropertyListTable";
import { Property } from "./types";

interface DivisionSummary {
  registeredProperties: number;
  geoSequencingProperties: number;
  buildings: number;
  properties: number;
  residential: number;
  nonResidential: number;
  mixed: number;
  openPlots: number;
  assessed: number;
  unassessed: number;
  photoCount: number;
  planCount: number;
  revenue?: number;
  percentIncrease?: string;
}

interface GeoSequencingDivisionData {
  buildings: number;
  properties: number;
  residential: number;
  nonResidential: number;
  mixed: number;
  openPlots: number;
  assessed: number;
  unassessed: number;
  photoCount: number;
}

interface WorkflowDivisionListProps {
  stage: WorkflowStage;
  onBack: () => void;
  onDivisionClick?: (division: string) => void;
  onPropertyTypeClick?: (division: string, propertyType: 'Assessed' | 'Unassessed') => void;
  divisionSummaries?: Record<string, DivisionSummary>;
  currentStageCount?: number;
  baselineByDivision?: Record<string, number>;
  geoSequencingDataByDivision?: Record<string, GeoSequencingDivisionData>;
  revenueByDivision?: Record<string, number>;
  baselineDemandByDivision?: Record<string, number>;
}

const divisionData = [
  {
    id: 1,
    name: "Zone 1 - Central",
    registeredProperties: 4500,
    geoSequencingProperties: 4387,
    buildings: 2856,
    properties: 4245,
    residential: 2734,
    nonResidential: 898,
    mixed: 456,
    openPlots: 157,
    assessed: 3628,
    unassessed: 617,
    photoCount: 3942,
    planCount: 3789
  },
  {
    id: 2,
    name: "Zone 2 - East",
    registeredProperties: 5450,
    geoSequencingProperties: 5298,
    buildings: 3245,
    properties: 5167,
    residential: 3423,
    nonResidential: 1078,
    mixed: 489,
    openPlots: 177,
    assessed: 4389,
    unassessed: 778,
    photoCount: 4832,
    planCount: 4698
  },
  {
    id: 3,
    name: "Zone 3 - West",
    registeredProperties: 3850,
    geoSequencingProperties: 3745,
    buildings: 2189,
    properties: 3623,
    residential: 2312,
    nonResidential: 789,
    mixed: 334,
    openPlots: 188,
    assessed: 2945,
    unassessed: 678,
    photoCount: 3234,
    planCount: 3098
  },
  {
    id: 4,
    name: "Zone 4 - North",
    registeredProperties: 6200,
    geoSequencingProperties: 6034,
    buildings: 3634,
    properties: 5834,
    residential: 3756,
    nonResidential: 1245,
    mixed: 613,
    openPlots: 220,
    assessed: 4923,
    unassessed: 911,
    photoCount: 5389,
    planCount: 5245
  },
  {
    id: 5,
    name: "Zone 5 - South",
    registeredProperties: 4700,
    geoSequencingProperties: 4578,
    buildings: 2867,
    properties: 4456,
    residential: 2845,
    nonResidential: 956,
    mixed: 478,
    openPlots: 177,
    assessed: 3701,
    unassessed: 755,
    photoCount: 4134,
    planCount: 3989
  }
];

const getStageTitle = (stage: WorkflowStage) => {
  const titles = {
    "Geo-sequencing": "Geo-sequencing",
    "Internal Survey": "Internal Survey",
    "Data Processing": "Data Processing",
    "Quality Analyst": "Quality Analyst",
    "Forward to ULB": "Forward to ULB",
    "Approved by ULB": "Approved by ULB",
    "Notice Distribution": "Notice Distribution",
    "Bills Distribution": "Bills Distribution"
  };
  return titles[stage];
};

const getStageColor = (stage: WorkflowStage) => {
  const colors = {
    "Geo-sequencing": { from: "from-indigo-600", to: "to-purple-600", light: "bg-indigo-50", text: "text-indigo-700" },
    "Internal Survey": { from: "from-purple-600", to: "to-pink-600", light: "bg-purple-50", text: "text-purple-700" },
    "Data Processing": { from: "from-cyan-600", to: "to-blue-600", light: "bg-cyan-50", text: "text-cyan-700" },
    "Quality Analyst": { from: "from-green-600", to: "to-emerald-600", light: "bg-green-50", text: "text-green-700" },
    "Forward to ULB": { from: "from-pink-600", to: "to-rose-600", light: "bg-pink-50", text: "text-pink-700" },
    "Approved by ULB": { from: "from-teal-600", to: "to-cyan-600", light: "bg-teal-50", text: "text-teal-700" },
    "Notice Distribution": { from: "from-orange-600", to: "to-amber-600", light: "bg-orange-50", text: "text-orange-700" },
    "Bills Distribution": { from: "from-red-600", to: "to-rose-600", light: "bg-red-50", text: "text-red-700" }
  };
  return colors[stage];
};

type CountFilterType = 
  | "registeredProperties"
  | "geoSequencingBuildings"
  | "geoSequencingProperties"
  | "surveyBuildings"
  | "surveyProperties"
  | "dataProcessingBuildings"
  | "dataProcessingProperties"
  | "qualityAnalystBuildings"
  | "qualityAnalystProperties"
  | "forwardToULBBuildings"
  | "forwardToULBProperties"
  | "approvedByULBProperties"
  | "noticeDistributionProperties"
  | "billsDistributionProperties"
  | "residential"
  | "nonResidential"
  | "mixed"
  | "openPlots"
  | "assessed"
  | "unassessed"
  | "photoCount"
  | "planCount";

export function WorkflowDivisionList({ stage, onBack, onDivisionClick, onPropertyTypeClick, divisionSummaries, currentStageCount, baselineByDivision, geoSequencingDataByDivision, revenueByDivision, baselineDemandByDivision }: WorkflowDivisionListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [propertySearchQuery, setPropertySearchQuery] = useState("");
  const [showPropertyListDialog, setShowPropertyListDialog] = useState(false);
  const [selectedCountFilter, setSelectedCountFilter] = useState<CountFilterType | null>(null);
  const [selectedDivisionForCount, setSelectedDivisionForCount] = useState<string>("");
  const [filteredPropertiesForCount, setFilteredPropertiesForCount] = useState<Property[]>([]);
  const colors = getStageColor(stage);
  const isQualityAnalyst = stage === "Quality Analyst";

  // Get completed properties that are ready to forward (mock data for now)
  const completedProperties = generateMockProperties("Quality Analyst").slice(0, 20);
  
  // Use dynamic division summaries if provided, otherwise fallback to static data
  const dynamicDivisionData = divisionSummaries 
    ? Object.entries(divisionSummaries).map(([name, summary], index) => {
        // For Geo-sequencing stage, use geo-sequencing data
        if (stage === "Geo-sequencing" && geoSequencingDataByDivision?.[name]) {
          const geoData = geoSequencingDataByDivision[name];
          return {
            id: index + 1,
            name,
            registeredProperties: baselineByDivision?.[name] || 0,
            geoSequencingProperties: geoData.properties || 0,
            buildings: geoData.buildings || 0,
            properties: geoData.properties || 0,
            residential: geoData.residential || 0,
            nonResidential: geoData.nonResidential || 0,
            mixed: geoData.mixed || 0,
            openPlots: geoData.openPlots || 0,
            assessed: geoData.assessed || 0,
            unassessed: geoData.unassessed || 0,
            photoCount: geoData.photoCount || 0,
            planCount: 0,
          };
        }
        // For Internal Survey stage, include geo-sequencing data
        if (stage === "Internal Survey" && geoSequencingDataByDivision?.[name]) {
          const geoData = geoSequencingDataByDivision[name];
          return {
            id: index + 1,
            name,
            registeredProperties: baselineByDivision?.[name] || summary.registeredProperties || 0,
            geoSequencingProperties: geoData.properties || 0,
            buildings: summary.buildings || 0,
            properties: summary.properties || 0,
            residential: summary.residential || 0,
            nonResidential: summary.nonResidential || 0,
            mixed: summary.mixed || 0,
            openPlots: summary.openPlots || 0,
            assessed: summary.assessed || 0,
            unassessed: summary.unassessed || 0,
            photoCount: summary.photoCount || 0,
            planCount: summary.planCount || 0,
          };
        }
        // For Quality Analyst, Forward to ULB, Approved by ULB, and Notice Distribution stages
        if ((stage === "Quality Analyst" || stage === "Forward to ULB" || stage === "Approved by ULB" || stage === "Notice Distribution") && geoSequencingDataByDivision?.[name]) {
          const geoData = geoSequencingDataByDivision[name];
          const revenue = revenueByDivision?.[name] || 0;
          const baselineDemand = baselineDemandByDivision?.[name] || 0;
          const percentIncrease = baselineDemand > 0 
            ? ((revenue - baselineDemand) / baselineDemand * 100).toFixed(1)
            : '0.0';
          return {
            id: index + 1,
            name,
            registeredProperties: baselineByDivision?.[name] || summary.registeredProperties || 0,
            geoSequencingProperties: geoData.properties || 0,
            buildings: summary.buildings || 0,
            properties: summary.properties || 0,
            residential: summary.residential || 0,
            nonResidential: summary.nonResidential || 0,
            mixed: summary.mixed || 0,
            openPlots: summary.openPlots || 0,
            assessed: summary.assessed || 0,
            unassessed: summary.unassessed || 0,
            photoCount: summary.photoCount || 0,
            planCount: summary.planCount || 0,
            revenue,
            percentIncrease,
          };
        }
        // For other stages
        return {
          id: index + 1,
          name,
          registeredProperties: baselineByDivision?.[name] || summary.registeredProperties || 0,
          geoSequencingProperties: summary.geoSequencingProperties || 0,
          buildings: summary.buildings || 0,
          properties: summary.properties || 0,
          residential: summary.residential || 0,
          nonResidential: summary.nonResidential || 0,
          mixed: summary.mixed || 0,
          openPlots: summary.openPlots || 0,
          assessed: summary.assessed || 0,
          unassessed: summary.unassessed || 0,
          photoCount: summary.photoCount || 0,
          planCount: summary.planCount || 0,
        };
      })
    : divisionData;
  
  // Filter divisions based on search query
  const filteredData = dynamicDivisionData.filter((division) =>
    division.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalRegisteredProperties = filteredData.reduce((sum, d) => sum + d.registeredProperties, 0);
  const totalGeoSequencingProperties = filteredData.reduce((sum, d) => sum + d.geoSequencingProperties, 0);
  const totalBuildings = filteredData.reduce((sum, d) => sum + d.buildings, 0);
  const totalProperties = filteredData.reduce((sum, d) => sum + d.properties, 0);
  const totalResidential = filteredData.reduce((sum, d) => sum + d.residential, 0);
  const totalNonResidential = filteredData.reduce((sum, d) => sum + d.nonResidential, 0);
  const totalMixed = filteredData.reduce((sum, d) => sum + d.mixed, 0);
  const totalOpenPlots = filteredData.reduce((sum, d) => sum + d.openPlots, 0);
  const totalAssessed = filteredData.reduce((sum, d) => sum + d.assessed, 0);
  const totalUnassessed = filteredData.reduce((sum, d) => sum + d.unassessed, 0);
  const totalPhotos = filteredData.reduce((sum, d) => sum + d.photoCount, 0);
  const totalPlans = filteredData.reduce((sum, d) => sum + d.planCount, 0);
  const totalRevenue = filteredData.reduce((sum, d) => sum + (d.revenue || 0), 0);
  
  const totalBaselineDemand = filteredData.reduce((sum, d) => {
    const baselineDemand = baselineDemandByDivision?.[d.name] || 0;
    return sum + baselineDemand;
  }, 0);
  const totalPercentIncrease = totalBaselineDemand > 0 
    ? ((totalRevenue - totalBaselineDemand) / totalBaselineDemand * 100).toFixed(1)
    : '0.0';

  const togglePropertySelection = (propertyId: string) => {
    const newSelected = new Set(selectedProperties);
    if (newSelected.has(propertyId)) {
      newSelected.delete(propertyId);
    } else {
      newSelected.add(propertyId);
    }
    setSelectedProperties(newSelected);
  };

  const toggleSelectAll = () => {
    const filtered = filteredCompletedProperties;
    if (selectedProperties.size === filtered.length) {
      setSelectedProperties(new Set());
    } else {
      setSelectedProperties(new Set(filtered.map(p => p.id)));
    }
  };

  const toggleRow = (propertyId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(propertyId)) {
      newExpanded.delete(propertyId);
    } else {
      newExpanded.add(propertyId);
    }
    setExpandedRows(newExpanded);
  };

  const handleForwardToAssessment = () => {
    console.log("Forwarding properties to Assessment portal:", selectedProperties);
    toast.success(`${selectedProperties.size} properties sent to Approval Portal`);
    setSelectedProperties(new Set());
    setShowForwardDialog(false);
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    let headers: string[] = [];
    
    if (stage === "Geo-sequencing") {
      headers = ["Division", "Registered Properties", "Geo-sequencing Properties", "Residential", "Non-Residential", "Mixed", "Open Plots", "Assessed", "Unassessed", "Photos"];
    } else if (stage === "Internal Survey") {
      headers = ["Division", "Buildings", "Properties", "Residential", "Non-Residential", "Mixed", "Open Plots", "Assessed", "Unassessed", "Photos"];
    } else if (stage === "Approved by ULB") {
      headers = ["Division", "Approved Properties", "Residential", "Non-Residential", "Mixed", "Open Plots", "Assessed", "Unassessed", "Photos", "Plans", "Revenue (₹)", "% Increase"];
    } else {
      headers = ["Division", "Buildings", "Properties", "Residential", "Non-Residential", "Mixed", "Open Plots", "Assessed", "Unassessed", "Photos", "Plans"];
    }

    const exportDataRows = filteredData.map(row => {
      const baseData: any = { division: row.name };
      
      if (stage === "Geo-sequencing") {
        return { ...baseData, registeredproperties: row.registeredProperties, geosequencingproperties: row.geoSequencingProperties, residential: row.residential, nonresidential: row.nonResidential, mixed: row.mixed, openplots: row.openPlots, assessed: row.assessed, unassessed: row.unassessed, photos: row.photoCount };
      } else if (stage === "Approved by ULB") {
        return { ...baseData, approvedproperties: row.properties, residential: row.residential, nonresidential: row.nonResidential, mixed: row.mixed, openplots: row.openPlots, assessed: row.assessed, unassessed: row.unassessed, photos: row.photoCount, plans: row.planCount, 'revenue(₹)': row.revenue || 0, '%increase': row.percentIncrease || '0.0' };
      } else {
        return { ...baseData, buildings: row.buildings, properties: row.properties, residential: row.residential, nonresidential: row.nonResidential, mixed: row.mixed, openplots: row.openPlots, assessed: row.assessed, unassessed: row.unassessed, photos: row.photoCount, plans: row.planCount };
      }
    });

    const totalsData: any = { division: 'TOTAL' };
    if (stage === "Geo-sequencing") {
      totalsData.registeredproperties = totalRegisteredProperties;
      totalsData.geosequencingproperties = totalGeoSequencingProperties;
      totalsData.residential = totalResidential;
      totalsData.nonresidential = totalNonResidential;
      totalsData.mixed = totalMixed;
      totalsData.openplots = totalOpenPlots;
      totalsData.assessed = totalAssessed;
      totalsData.unassessed = totalUnassessed;
      totalsData.photos = totalPhotos;
    } else if (stage === "Approved by ULB") {
      totalsData.approvedproperties = totalProperties;
      totalsData.residential = totalResidential;
      totalsData.nonresidential = totalNonResidential;
      totalsData.mixed = totalMixed;
      totalsData.openplots = totalOpenPlots;
      totalsData.assessed = totalAssessed;
      totalsData.unassessed = totalUnassessed;
      totalsData.photos = totalPhotos;
      totalsData.plans = totalPlans;
      totalsData['revenue(₹)'] = totalRevenue;
      totalsData['%increase'] = totalPercentIncrease;
    } else {
      totalsData.buildings = totalBuildings;
      totalsData.properties = totalProperties;
      totalsData.residential = totalResidential;
      totalsData.nonresidential = totalNonResidential;
      totalsData.mixed = totalMixed;
      totalsData.openplots = totalOpenPlots;
      totalsData.assessed = totalAssessed;
      totalsData.unassessed = totalUnassessed;
      totalsData.photos = totalPhotos;
      totalsData.plans = totalPlans;
    }

    const exportData = {
      stage,
      data: exportDataRows,
      totals: totalsData,
      headers,
      title: 'Property Tax Data Center - Division-wise Summary',
      subtitle: `Workflow Stage: ${stage}`,
    };

    if (format === 'excel') {
      exportToExcel(exportData);
      toast.success('Excel file downloaded successfully');
    } else {
      exportToPDF(exportData);
      toast.success('PDF file downloaded successfully');
    }
  };

  const filteredCompletedProperties = completedProperties.filter(property => {
    const searchLower = propertySearchQuery.toLowerCase();
    return (
      property.propertyNumber.toLowerCase().includes(searchLower) ||
      property.ownerName.toLowerCase().includes(searchLower) ||
      property.address.toLowerCase().includes(searchLower)
    );
  });

  const handleCountClick = (
    e: React.MouseEvent,
    filterType: CountFilterType,
    divisionName: string
  ) => {
    e.stopPropagation();
    setSelectedCountFilter(filterType);
    setSelectedDivisionForCount(divisionName);
    
    const mockProperties = generateMockProperties(stage);
    let filtered: Property[] = mockProperties;
    
    if (divisionName !== "All Divisions") {
      filtered = filtered.filter(p => {
        const divName = p.zone.replace('Zone-', 'Zone ') + ' - Central';
        return divName === divisionName;
      });
    }
    
    switch (filterType) {
      case "geoSequencingBuildings":
      case "surveyBuildings":
      case "dataProcessingBuildings":
      case "qualityAnalystBuildings":
      case "forwardToULBBuildings":
        filtered = filtered.filter(p => p.propertyCategory === "Individual");
        break;
      case "residential":
        filtered = filtered.filter(p => p.nature === "Residential");
        break;
      case "nonResidential":
        filtered = filtered.filter(p => p.nature === "Commercial" || p.nature === "Industrial");
        break;
      case "mixed":
        filtered = filtered.filter(p => p.nature === "Mixed");
        break;
      case "openPlots":
        filtered = filtered.filter(p => p.nature === "Open Plot");
        break;
      case "assessed":
        filtered = filtered.filter((p, i) => i % 5 !== 0);
        break;
      case "unassessed":
        filtered = filtered.filter((p, i) => i % 5 === 0);
        break;
      case "photoCount":
        filtered = filtered.filter(p => p.documents && p.documents.some(d => d.type === "image"));
        break;
      case "planCount":
        filtered = filtered.filter(p => p.documents && p.documents.some(d => d.type === "pdf"));
        break;
    }
    
    setFilteredPropertiesForCount(filtered);
    setShowPropertyListDialog(true);
  };

  const getCountFilterLabel = (filterType: CountFilterType | null): string => {
    const labels: Record<CountFilterType, string> = {
      registeredProperties: "Registered Properties",
      geoSequencingBuildings: "Geo-Sequencing Buildings",
      geoSequencingProperties: "Geo-Sequencing Properties",
      surveyBuildings: "Survey Buildings",
      surveyProperties: "Survey Properties",
      dataProcessingBuildings: "Data Processing Buildings",
      dataProcessingProperties: "Data Processing Properties",
      qualityAnalystBuildings: "Quality Analyst Buildings",
      qualityAnalystProperties: "Quality Analyst Properties",
      forwardToULBBuildings: "Forward to ULB Buildings",
      forwardToULBProperties: "Forward to ULB Properties",
      approvedByULBProperties: "Approved by ULB Properties",
      noticeDistributionProperties: "Notice Distribution Properties",
      billsDistributionProperties: "Bills Distribution Properties",
      residential: "Residential Properties",
      nonResidential: "Non-Residential Properties",
      mixed: "Mixed Properties",
      openPlots: "Open Plot Properties",
      assessed: "Assessed Properties",
      unassessed: "Unassessed Properties",
      photoCount: "Properties with Photos",
      planCount: "Properties with Plans",
    };
    return filterType ? labels[filterType] : "";
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Compact Header with Gradient */}
      <div className={`bg-gradient-to-r ${colors.from} ${colors.to} px-3 py-2 shadow-md flex-shrink-0`}>
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm leading-tight">
                {getStageTitle(stage)} - Division Summary
              </h1>
              <p className="text-white/80 text-[10px] leading-tight">विभागीय कार्यालयनिहाय संपत्ती माहिती</p>
            </div>
          </div>

          {/* Quick Stats - Inline */}
          <div className="flex items-center gap-3 text-white">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
              <Building2 className="h-3.5 w-3.5" />
              <div className="text-[10px]">
                <div className="text-white/70">Buildings</div>
                <div className="font-semibold">{totalBuildings.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
              <Home className="h-3.5 w-3.5" />
              <div className="text-[10px]">
                <div className="text-white/70">Properties</div>
                <div className="font-semibold">{totalProperties.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
              <FileCheck2 className="h-3.5 w-3.5" />
              <div className="text-[10px]">
                <div className="text-white/70">Assessed</div>
                <div className="font-semibold text-green-200">{totalAssessed.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
              <ImageIcon className="h-3.5 w-3.5" />
              <div className="text-[10px]">
                <div className="text-white/70">Photos</div>
                <div className="font-semibold">{totalPhotos.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                type="text"
                placeholder="Search divisions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-7 text-[10px] pl-7 pr-2 w-44 border-white/30 bg-white/90 placeholder:text-gray-500"
              />
            </div>

            {isQualityAnalyst && (
              <Button
                size="sm"
                className="h-7 text-[10px] gap-1 bg-white text-green-700 hover:bg-white/90"
                onClick={() => setShowForwardDialog(true)}
              >
                <Send className="h-3 w-3" />
                Send to Approval
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-white/30 bg-white/90 hover:bg-white">
                  <Download className="h-3 w-3" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('excel')} className="gap-2 text-xs">
                  <FileSpreadsheet className="h-3.5 w-3.5 text-green-600" />
                  <span>Export to Excel</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2 text-xs">
                  <FileText className="h-3.5 w-3.5 text-red-600" />
                  <span>Export to PDF</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Table Container - Scrollable */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-[9px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-slate-100 to-slate-200">
              <th rowSpan={2} className="border border-gray-300 px-1 py-1.5 text-center font-semibold text-gray-700 w-8">
                #
              </th>
              <th rowSpan={2} className="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700 min-w-[110px]">
                Division
              </th>
              {stage === "Internal Survey" && (
                <th rowSpan={2} className="border border-gray-300 px-1 py-1.5 text-center font-semibold text-gray-700 bg-yellow-50">
                  Geo-Seq
                </th>
              )}
              <th colSpan={2} className="border border-gray-300 px-1 py-1.5 text-center font-semibold text-gray-700 bg-blue-50">
                {stage === "Internal Survey" ? "Survey" : stage}
              </th>
              <th colSpan={4} className="border border-gray-300 px-1 py-1.5 text-center font-semibold text-gray-700 bg-purple-50">
                Property Type
              </th>
              <th rowSpan={2} className="border border-gray-300 px-1 py-1.5 text-center font-semibold text-gray-700 bg-green-50">
                Assessed
              </th>
              <th rowSpan={2} className="border border-gray-300 px-1 py-1.5 text-center font-semibold text-gray-700 bg-orange-50">
                Unassessed
              </th>
              <th rowSpan={2} className="border border-gray-300 px-1 py-1.5 text-center font-semibold text-gray-700 bg-cyan-50">
                Photos
              </th>
              {stage !== "Internal Survey" && stage !== "Geo-sequencing" && (
                <th rowSpan={2} className="border border-gray-300 px-1 py-1.5 text-center font-semibold text-gray-700 bg-indigo-50">
                  Plans
                </th>
              )}
            </tr>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
              <th className="border border-gray-300 px-1 py-1 text-center font-semibold text-gray-700 bg-blue-50">
                Bldgs
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center font-semibold text-gray-700 bg-blue-50">
                Props
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center font-semibold text-gray-700 bg-purple-50">
                Resi
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center font-semibold text-gray-700 bg-purple-50">
                Comm
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center font-semibold text-gray-700 bg-purple-50">
                Mixed
              </th>
              <th className="border border-gray-300 px-1 py-1 text-center font-semibold text-gray-700 bg-purple-50">
                Plots
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr
                key={row.id}
                className="hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => onDivisionClick?.(row.name)}
              >
                <td className="border border-gray-300 px-1 py-1 text-center text-gray-600">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5 text-blue-600 flex-shrink-0" />
                    <span className="text-blue-700 font-medium">{row.name}</span>
                  </div>
                </td>
                {stage === "Internal Survey" && (
                  <td 
                    className="border border-gray-300 px-1 py-1 text-center font-medium text-yellow-700 cursor-pointer hover:bg-yellow-100 transition-colors"
                    onClick={(e) => handleCountClick(e, "geoSequencingProperties", row.name)}
                    title="Click to view properties"
                  >
                    {row.geoSequencingProperties}
                  </td>
                )}
                <td 
                  className="border border-gray-300 px-1 py-1 text-center font-medium text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={(e) => handleCountClick(e, "surveyBuildings", row.name)}
                  title="Click to view properties"
                >
                  {row.buildings}
                </td>
                <td 
                  className="border border-gray-300 px-1 py-1 text-center font-medium text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={(e) => handleCountClick(e, "surveyProperties", row.name)}
                  title="Click to view properties"
                >
                  {row.properties}
                </td>
                <td 
                  className="border border-gray-300 px-1 py-1 text-center font-medium text-purple-700 cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={(e) => handleCountClick(e, "residential", row.name)}
                  title="Click to view properties"
                >
                  {row.residential}
                </td>
                <td 
                  className="border border-gray-300 px-1 py-1 text-center font-medium text-purple-700 cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={(e) => handleCountClick(e, "nonResidential", row.name)}
                  title="Click to view properties"
                >
                  {row.nonResidential}
                </td>
                <td 
                  className="border border-gray-300 px-1 py-1 text-center font-medium text-purple-700 cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={(e) => handleCountClick(e, "mixed", row.name)}
                  title="Click to view properties"
                >
                  {row.mixed}
                </td>
                <td 
                  className="border border-gray-300 px-1 py-1 text-center font-medium text-purple-700 cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={(e) => handleCountClick(e, "openPlots", row.name)}
                  title="Click to view properties"
                >
                  {row.openPlots}
                </td>
                <td 
                  className="border border-gray-300 px-1 py-1 text-center font-medium text-green-700 cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPropertyTypeClick?.(row.name, 'Assessed');
                  }}
                  title="Click to view assessed properties"
                >
                  {row.assessed}
                </td>
                <td 
                  className="border border-gray-300 px-1 py-1 text-center font-medium text-orange-700 cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPropertyTypeClick?.(row.name, 'Unassessed');
                  }}
                  title="Click to view unassessed properties"
                >
                  {row.unassessed}
                </td>
                <td 
                  className="border border-gray-300 px-1 py-1 text-center font-medium text-cyan-700 cursor-pointer hover:bg-cyan-100 transition-colors"
                  onClick={(e) => handleCountClick(e, "photoCount", row.name)}
                  title="Click to view properties"
                >
                  {row.photoCount}
                </td>
                {stage !== "Internal Survey" && stage !== "Geo-sequencing" && (
                  <td 
                    className="border border-gray-300 px-1 py-1 text-center font-medium text-indigo-700 cursor-pointer hover:bg-indigo-100 transition-colors"
                    onClick={(e) => handleCountClick(e, "planCount", row.name)}
                    title="Click to view properties"
                  >
                    {row.planCount}
                  </td>
                )}
              </tr>
            ))}
            
            {/* Total Row */}
            <tr className="bg-gradient-to-r from-slate-100 to-slate-200 font-semibold sticky bottom-0">
              <td colSpan={2} className="border border-gray-300 px-2 py-1.5 text-center text-gray-700">
                TOTAL
              </td>
              {stage === "Internal Survey" && (
                <td 
                  className="border border-gray-300 px-1 py-1.5 text-center text-yellow-700 cursor-pointer hover:bg-yellow-200 transition-colors"
                  onClick={(e) => handleCountClick(e, "geoSequencingProperties", "All Divisions")}
                  title="Click to view properties"
                >
                  {totalGeoSequencingProperties}
                </td>
              )}
              <td 
                className="border border-gray-300 px-1 py-1.5 text-center text-blue-700 cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={(e) => handleCountClick(e, "surveyBuildings", "All Divisions")}
                title="Click to view properties"
              >
                {totalBuildings}
              </td>
              <td 
                className="border border-gray-300 px-1 py-1.5 text-center text-blue-700 cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={(e) => handleCountClick(e, "surveyProperties", "All Divisions")}
                title="Click to view properties"
              >
                {totalProperties}
              </td>
              <td 
                className="border border-gray-300 px-1 py-1.5 text-center text-purple-700 cursor-pointer hover:bg-purple-200 transition-colors"
                onClick={(e) => handleCountClick(e, "residential", "All Divisions")}
                title="Click to view properties"
              >
                {totalResidential}
              </td>
              <td 
                className="border border-gray-300 px-1 py-1.5 text-center text-purple-700 cursor-pointer hover:bg-purple-200 transition-colors"
                onClick={(e) => handleCountClick(e, "nonResidential", "All Divisions")}
                title="Click to view properties"
              >
                {totalNonResidential}
              </td>
              <td 
                className="border border-gray-300 px-1 py-1.5 text-center text-purple-700 cursor-pointer hover:bg-purple-200 transition-colors"
                onClick={(e) => handleCountClick(e, "mixed", "All Divisions")}
                title="Click to view properties"
              >
                {totalMixed}
              </td>
              <td 
                className="border border-gray-300 px-1 py-1.5 text-center text-purple-700 cursor-pointer hover:bg-purple-200 transition-colors"
                onClick={(e) => handleCountClick(e, "openPlots", "All Divisions")}
                title="Click to view properties"
              >
                {totalOpenPlots}
              </td>
              <td 
                className="border border-gray-300 px-1 py-1.5 text-center text-green-700 cursor-pointer hover:bg-green-200 transition-colors"
                onClick={(e) => handleCountClick(e, "assessed", "All Divisions")}
                title="Click to view properties"
              >
                {totalAssessed}
              </td>
              <td 
                className="border border-gray-300 px-1 py-1.5 text-center text-orange-700 cursor-pointer hover:bg-orange-200 transition-colors"
                onClick={(e) => handleCountClick(e, "unassessed", "All Divisions")}
                title="Click to view properties"
              >
                {totalUnassessed}
              </td>
              <td 
                className="border border-gray-300 px-1 py-1.5 text-center text-cyan-700 cursor-pointer hover:bg-cyan-200 transition-colors"
                onClick={(e) => handleCountClick(e, "photoCount", "All Divisions")}
                title="Click to view properties"
              >
                {totalPhotos}
              </td>
              {stage !== "Internal Survey" && stage !== "Geo-sequencing" && (
                <td 
                  className="border border-gray-300 px-1 py-1.5 text-center text-indigo-700 cursor-pointer hover:bg-indigo-200 transition-colors"
                  onClick={(e) => handleCountClick(e, "planCount", "All Divisions")}
                  title="Click to view properties"
                >
                  {totalPlans}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Forward to Approval Dialog - Full Page */}
      {showForwardDialog && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-b-2 border-green-300 px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">Send to Approval Portal</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Select completed properties to forward to the Approval screen
                </p>
              </div>
              <div className="flex items-center gap-3">
                {selectedProperties.size > 0 && (
                  <span className="text-lg text-green-700 font-semibold bg-green-50 px-4 py-2 rounded-lg border border-green-300">
                    {selectedProperties.size} selected
                  </span>
                )}
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setShowForwardDialog(false)}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  size="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleForwardToAssessment}
                  disabled={selectedProperties.size === 0}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send to Approval Portal ({selectedProperties.size})
                </Button>
              </div>
            </div>

            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by Property No., Owner Name, Address..."
                value={propertySearchQuery}
                onChange={(e) => setPropertySearchQuery(e.target.value)}
                className="h-10 pl-10 pr-4 border-gray-300 bg-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto px-6 py-4 bg-gray-50 min-h-0">
            <table className="w-full border-collapse text-sm bg-white shadow-sm rounded-lg overflow-hidden">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-green-100 to-emerald-100">
                <tr>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700 w-14">
                    <Checkbox
                      checked={selectedProperties.size === filteredCompletedProperties.length && filteredCompletedProperties.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700 w-14"></th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700 w-[15%]">
                    Property Details
                    <div className="text-xs font-normal text-gray-500">Zone / Ward / Property No</div>
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700 w-[12%]">
                    Category & Type
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700 w-[15%]">
                    Owner & Occupier
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700 w-[10%]">
                    Nature
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700 w-[20%]">
                    Address
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700 w-[8%]">
                    Area (sq.ft)
                  </th>
                  <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700 bg-green-50 w-[12%]">
                    Tax Info
                    <div className="text-xs font-normal text-gray-500">Previous / Revised</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCompletedProperties.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="border border-gray-300 p-8 text-center text-gray-500">
                      No completed properties found
                    </td>
                  </tr>
                ) : (
                  filteredCompletedProperties.map((property) => (
                    <>
                      <tr
                        key={property.id}
                        className={`hover:bg-green-50 transition-colors ${property.subProperties ? 'bg-blue-50/30' : ''}`}
                      >
                        <td className="border border-gray-300 p-3 text-center">
                          <Checkbox
                            checked={selectedProperties.has(property.id)}
                            onCheckedChange={() => togglePropertySelection(property.id)}
                          />
                        </td>
                        <td className="border border-gray-300 p-3 text-center">
                          {property.subProperties && property.subProperties.length > 0 && (
                            <button
                              onClick={() => toggleRow(property.id)}
                              className="hover:bg-green-100 p-1 rounded"
                            >
                              {expandedRows.has(property.id) ? (
                                <ChevronDown className="w-5 h-5 text-green-600" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-green-600" />
                              )}
                            </button>
                          )}
                        </td>
                        <td className="border border-gray-300 p-3">
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">{property.zone}</div>
                            <div className="text-xs text-green-600 font-semibold">{property.ward}</div>
                            <div className="font-mono text-green-700 font-semibold">{property.propertyNumber}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 p-3">
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-xs">{property.propertyCategory}</Badge>
                            <div className="text-gray-700 text-xs">{property.propertyType}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 p-3">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-700 text-xs">Owner: {property.ownerName}</div>
                            <div className="text-gray-600 text-xs">Occupier: {property.occupierName}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 p-3 text-center">
                          <Badge className={
                            property.nature === "Residential" ? "bg-blue-600 text-white text-xs" :
                            property.nature === "Commercial" ? "bg-purple-600 text-white text-xs" :
                            "bg-orange-600 text-white text-xs"
                          }>
                            {property.nature}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 p-3 text-gray-600 text-xs">
                          {property.address}
                        </td>
                        <td className="border border-gray-300 p-3 text-center font-medium text-gray-700 text-xs">
                          {property.builtUpArea?.toLocaleString() || 'N/A'}
                        </td>
                        <td className="border border-gray-300 p-3 text-center bg-green-50">
                          <div className="space-y-1">
                            <div className="text-xs text-gray-600">₹{property.previousTax?.toLocaleString() || '0'}</div>
                            <div className="font-semibold text-green-700 text-xs">₹{property.revisedTax?.toLocaleString() || '0'}</div>
                          </div>
                        </td>
                      </tr>

                      {property.subProperties && property.subProperties.length > 0 && expandedRows.has(property.id) && (
                        <>
                          <tr className="bg-green-50">
                            <td colSpan={2} className="border border-gray-300"></td>
                            <td className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs bg-green-100">Unit No</td>
                            <td className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs bg-green-100">Type</td>
                            <td className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs bg-green-100">Owner & Occupier</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-xs bg-green-100">Floor</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-xs bg-green-100">Area (sq.ft)</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-xs bg-green-100">Taxable Area</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-xs bg-green-100">
                              Tax (₹)
                              <div className="text-[10px] font-normal text-gray-600">Prev / Revised</div>
                            </td>
                          </tr>
                          {property.subProperties.map((sub) => (
                            <tr key={sub.id} className="bg-green-50/50 hover:bg-green-100/50">
                              <td colSpan={2} className="border border-gray-300"></td>
                              <td className="border border-gray-300 px-3 py-2">
                                <div className="font-semibold text-green-700 text-xs">{sub.unitNumber}</div>
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                <Badge variant="outline" className="text-xs">{sub.unitType}</Badge>
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                <div className="space-y-0.5">
                                  <div className="text-xs text-gray-700">{sub.ownerName}</div>
                                  <div className="text-xs text-gray-600">{sub.occupierName}</div>
                                </div>
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-600">
                                {sub.floor || "-"}
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700 text-xs">
                                {sub.area.toLocaleString()}
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-center font-medium text-gray-700 text-xs">
                                {sub.taxableArea.toLocaleString()}
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-center">
                                <div className="space-y-0.5">
                                  <div className="text-xs text-gray-600">₹{sub.previousTax.toLocaleString()}</div>
                                  <div className="font-semibold text-green-700 text-xs">₹{sub.revisedTax.toLocaleString()}</div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Property List Full Screen View */}
      {showPropertyListDialog && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  {getCountFilterLabel(selectedCountFilter)}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedDivisionForCount === "All Divisions" 
                    ? "All Divisions" 
                    : selectedDivisionForCount} • {filteredPropertiesForCount.length} properties
                </p>
              </div>
              <Button
                variant="outline"
                size="default"
                onClick={() => setShowPropertyListDialog(false)}
                className="border-gray-300"
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto px-6 py-4 bg-gray-50 min-h-0">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <PropertyListTable
                properties={filteredPropertiesForCount}
                stage={stage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
