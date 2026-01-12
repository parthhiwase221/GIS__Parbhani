export type WorkflowStage =
  | "Geo-sequencing"
  | "Internal Survey"
  | "Data Processing"
  | "Quality Analyst"
  | "Forward to ULB"
  | "Approved by ULB"
  | "Notice Distribution"
  | "Bills Distribution";

export interface SubProperty {
  id: string;
  unitNumber: string;
  unitType: string;
  ownerName: string;
  occupierName: string;
  floor?: string;
  area: number;
  taxableArea: number;
  previousTax: number;
  revisedTax: number;
}

export interface Document {
  type: "image" | "pdf";
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Property {
  id: string;
  propertyNumber: string;
  zone: string;
  ward: string;
  propertyCategory: string;
  propertyType: string;
  ownerName: string;
  occupierName: string;
  nature: "Residential" | "Commercial" | "Industrial" | "Mixed" | "Open Plot";
  address: string;
  builtUpArea?: number;
  previousTax?: number;
  revisedTax?: number;
  status: string;
  documents?: Document[];
  subProperties?: SubProperty[];
}
