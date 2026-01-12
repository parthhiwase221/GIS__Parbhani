import { useState, Fragment } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Property, WorkflowStage } from "./types";

interface PropertyListTableProps {
  properties: Property[];
  stage: WorkflowStage;
}

export function PropertyListTable({ properties, stage }: PropertyListTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (propertyId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(propertyId)) {
      newExpanded.delete(propertyId);
    } else {
      newExpanded.add(propertyId);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse text-sm bg-white">
        <thead className="sticky top-0 z-10 bg-gradient-to-r from-blue-100 to-indigo-100">
          <tr>
            <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700 w-14">
              
            </th>
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
            <th className="border border-gray-300 p-3 text-center font-semibold text-gray-700 bg-blue-50 w-[12%]">
              Tax Info
              <div className="text-xs font-normal text-gray-500">Previous / Revised</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {properties.length === 0 ? (
            <tr>
              <td colSpan={8} className="border border-gray-300 p-8 text-center text-gray-500">
                No properties found
              </td>
            </tr>
          ) : (
            properties.map((property) => (
              <Fragment key={property.id}>
                {/* Main Property Row */}
                <tr
                  className={`hover:bg-blue-50 transition-colors ${property.subProperties ? 'bg-blue-50/30' : ''}`}
                >
                  <td className="border border-gray-300 p-3 text-center">
                    {property.subProperties && property.subProperties.length > 0 && (
                      <button
                        onClick={() => toggleRow(property.id)}
                        className="hover:bg-blue-100 p-1 rounded"
                      >
                        {expandedRows.has(property.id) ? (
                          <ChevronDown className="w-5 h-5 text-blue-600" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-blue-600" />
                        )}
                      </button>
                    )}
                  </td>
                  <td className="border border-gray-300 p-3">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">{property.zone}</div>
                      <div className="text-xs text-blue-600 font-semibold">{property.ward}</div>
                      <div className="font-mono text-blue-700 font-semibold">{property.propertyNumber}</div>
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
                      property.nature === "Industrial" ? "bg-orange-600 text-white text-xs" :
                      property.nature === "Mixed" ? "bg-green-600 text-white text-xs" :
                      "bg-gray-600 text-white text-xs"
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
                  <td className="border border-gray-300 p-3 text-center bg-blue-50">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">₹{property.previousTax?.toLocaleString() || '0'}</div>
                      <div className="font-semibold text-blue-700 text-xs">₹{property.revisedTax?.toLocaleString() || '0'}</div>
                    </div>
                  </td>
                </tr>

                {/* Expanded Sub-Properties */}
                {property.subProperties && property.subProperties.length > 0 && expandedRows.has(property.id) && (
                  <>
                    <tr className="bg-blue-50">
                      <td className="border border-gray-300"></td>
                      <td className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs bg-blue-100">
                        Unit No
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs bg-blue-100">
                        Type
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-left font-semibold text-xs bg-blue-100">
                        Owner & Occupier
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-xs bg-blue-100">
                        Floor
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-xs bg-blue-100">
                        Area (sq.ft)
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-xs bg-blue-100">
                        Taxable Area
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-xs bg-blue-100">
                        Tax (₹)
                        <div className="text-[10px] font-normal text-gray-600">Prev / Revised</div>
                      </td>
                    </tr>
                    {property.subProperties.map((sub) => (
                      <tr key={sub.id} className="bg-blue-50/50 hover:bg-blue-100/50">
                        <td className="border border-gray-300"></td>
                        <td className="border border-gray-300 px-3 py-2">
                          <div className="font-semibold text-blue-700 text-xs">{sub.unitNumber}</div>
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
                            <div className="font-semibold text-blue-700 text-xs">₹{sub.revisedTax.toLocaleString()}</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
