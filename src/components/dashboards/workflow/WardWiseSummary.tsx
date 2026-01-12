import { ArrowLeft, Building2, Home, MapPin, Search, Download, FileSpreadsheet, FileText, X } from "lucide-react";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { useState } from "react";
import { WorkflowStage } from "./types";
import { PropertyListTable } from "./PropertyListTable";
import { generateMockProperties } from "./mockData";

interface WardData {
  id: number;
  wardNo: string;
  wardName: string;
  buildings: number;
  properties: number;
  residential: number;
  nonResidential: number;
  mixed: number;
  openPlots: number;
  assessed: number;
  unassessed: number;
  photos: number;
}

interface WardWiseSummaryProps {
  divisionId: number;
  divisionName: string;
  selectedStage: WorkflowStage;
  onBack: () => void;
}

export function WardWiseSummary({ divisionId, divisionName, selectedStage, onBack }: WardWiseSummaryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWard, setSelectedWard] = useState<{ wardNo: string; wardName: string } | null>(null);
  const [showPropertyListDialog, setShowPropertyListDialog] = useState(false);

  // Generate ward-wise mock data based on division
  const getWardData = (): WardData[] => {
    const baseWards = [
      { wardNo: "W-01", wardName: "Panchpakhadi" },
      { wardNo: "W-02", wardName: "Kopri" },
      { wardNo: "W-03", wardName: "Mumbra" },
      { wardNo: "W-04", wardName: "Kausa" },
      { wardNo: "W-05", wardName: "Owale" },
      { wardNo: "W-06", wardName: "Balkum" },
      { wardNo: "W-07", wardName: "Majiwada" },
      { wardNo: "W-08", wardName: "Manpada" },
    ];

    return baseWards.map((ward, index) => {
      const multiplier = 0.8 + (index * 0.05) + (divisionId * 0.1);
      return {
        id: index + 1,
        wardNo: ward.wardNo,
        wardName: ward.wardName,
        buildings: Math.floor(350 * multiplier),
        properties: Math.floor(550 * multiplier),
        residential: Math.floor(340 * multiplier),
        nonResidential: Math.floor(120 * multiplier),
        mixed: Math.floor(60 * multiplier),
        openPlots: Math.floor(30 * multiplier),
        assessed: Math.floor(450 * multiplier),
        unassessed: Math.floor(100 * multiplier),
        photos: Math.floor(520 * multiplier),
      };
    });
  };

  const wardData = getWardData();
  
  const filteredWards = wardData.filter(ward =>
    ward.wardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ward.wardNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals
  const totals = filteredWards.reduce((acc, ward) => ({
    buildings: acc.buildings + ward.buildings,
    properties: acc.properties + ward.properties,
    residential: acc.residential + ward.residential,
    nonResidential: acc.nonResidential + ward.nonResidential,
    mixed: acc.mixed + ward.mixed,
    openPlots: acc.openPlots + ward.openPlots,
    assessed: acc.assessed + ward.assessed,
    unassessed: acc.unassessed + ward.unassessed,
    photos: acc.photos + ward.photos,
  }), {
    buildings: 0,
    properties: 0,
    residential: 0,
    nonResidential: 0,
    mixed: 0,
    openPlots: 0,
    assessed: 0,
    unassessed: 0,
    photos: 0,
  });

  const handleExport = () => {
    console.log("Exporting ward data...");
  };

  const handleWardClick = (wardNo: string, wardName: string) => {
    console.log("Ward clicked:", wardNo, wardName);
    setSelectedWard({ wardNo, wardName });
    setShowPropertyListDialog(true);
  };

  // Generate properties for the selected ward
  const wardProperties = selectedWard ? generateMockProperties(selectedStage, 50) : [];

  return (
    <div className="bg-white border border-indigo-200 rounded shadow-sm p-3">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Back button clicked - calling onBack()");
              onBack();
            }}
            className="h-8 gap-1.5 hover:bg-indigo-50 border-indigo-300 hover:border-indigo-400 z-10 relative"
            type="button"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Division Summary
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded text-white">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800 leading-tight">
                {divisionName} - Ward wise Summary ({selectedStage})
              </h2>
              <p className="text-[10px] text-gray-600">प्रभाग निहाय वार्डवार संपत्ती माहिती</p>
            </div>
          </div>
        </div>
        
        {/* Search and Export */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search wards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-[11px] pl-8 pr-3 w-40"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[11px] px-3">
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport} className="gap-2 text-xs">
                <FileSpreadsheet className="h-3.5 w-3.5 text-green-600" />
                <span>Export to Excel</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport} className="gap-2 text-xs">
                <FileText className="h-3.5 w-3.5 text-red-600" />
                <span>Export to PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 p-2">
          <div className="text-center">
            <p className="text-[10px] text-blue-700 font-medium mb-1 leading-tight">Total Buildings</p>
            <p className="text-base font-bold text-blue-900">{totals.buildings.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 p-2">
          <div className="text-center">
            <p className="text-[10px] text-purple-700 font-medium mb-1 leading-tight">Total Properties</p>
            <p className="text-base font-bold text-purple-900">{totals.properties.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-2">
          <div className="text-center">
            <p className="text-[10px] text-green-700 font-medium mb-1 leading-tight">Assessed</p>
            <p className="text-base font-bold text-green-900">{totals.assessed.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 p-2">
          <div className="text-center">
            <p className="text-[10px] text-orange-700 font-medium mb-1 leading-tight">Unassessed</p>
            <p className="text-base font-bold text-orange-900">{totals.unassessed.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 p-2">
          <div className="text-center">
            <p className="text-[10px] text-cyan-700 font-medium mb-1 leading-tight">Photos</p>
            <p className="text-base font-bold text-cyan-900">{totals.photos.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      {/* Ward Data Table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-slate-100 to-slate-200">
                <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-12">Sr.</th>
                <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 min-w-[80px]">Ward No.</th>
                <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 min-w-[140px]">Ward Name</th>
                <th colSpan={2} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 bg-purple-50">
                  {selectedStage} Properties
                </th>
                <th colSpan={4} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 bg-green-50">
                  Property Type
                </th>
                <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 bg-orange-50">Assessed</th>
                <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 bg-red-50">Unassessed</th>
                <th rowSpan={2} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 bg-cyan-50">Photos</th>
              </tr>
              <tr className="bg-slate-50">
                <th className="border border-gray-300 px-2 py-1.5 text-center font-medium text-gray-600 text-[10px] bg-purple-50">Buildings</th>
                <th className="border border-gray-300 px-2 py-1.5 text-center font-medium text-gray-600 text-[10px] bg-purple-50">Properties</th>
                <th className="border border-gray-300 px-2 py-1.5 text-center font-medium text-gray-600 text-[10px] bg-green-50">🏠 Residential</th>
                <th className="border border-gray-300 px-2 py-1.5 text-center font-medium text-gray-600 text-[10px] bg-green-50">🏢 Non-Residential</th>
                <th className="border border-gray-300 px-2 py-1.5 text-center font-medium text-gray-600 text-[10px] bg-green-50">🏘️ Mixed</th>
                <th className="border border-gray-300 px-2 py-1.5 text-center font-medium text-gray-600 text-[10px] bg-green-50">📐 Open Plots</th>
              </tr>
            </thead>
            <tbody>
              {filteredWards.map((ward) => (
                <tr key={ward.id} className="hover:bg-indigo-50 transition-colors">
                  <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">{ward.id}</td>
                  <td 
                    className="border border-gray-300 px-3 py-2 text-center cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleWardClick(ward.wardNo, ward.wardName)}
                    title="Click to view property list"
                  >
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100 cursor-pointer">
                      {ward.wardNo}
                    </Badge>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-left">
                    <div className="flex items-center gap-2">
                      <Home className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="font-medium text-gray-800">{ward.wardName}</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-purple-700">{ward.buildings.toLocaleString()}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-purple-700">{ward.properties.toLocaleString()}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">{ward.residential.toLocaleString()}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">{ward.nonResidential.toLocaleString()}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">{ward.mixed.toLocaleString()}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center text-gray-700">{ward.openPlots.toLocaleString()}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-green-700">{ward.assessed.toLocaleString()}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-orange-700">{ward.unassessed.toLocaleString()}</td>
                  <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-cyan-700">{ward.photos.toLocaleString()}</td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="bg-gradient-to-r from-slate-100 to-slate-200 font-bold">
                <td colSpan={3} className="border border-gray-300 px-3 py-2 text-center text-gray-800">Total</td>
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

      {/* Property List Full Screen View */}
      {showPropertyListDialog && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2 border-purple-200 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  {selectedWard ? `${selectedWard.wardNo} - ${selectedWard.wardName}` : ''} - Property List
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {divisionName} • {selectedStage} • {wardProperties.length} properties
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
                properties={wardProperties}
                stage={selectedStage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
