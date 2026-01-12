import { Property, SubProperty, WorkflowStage } from "./types";

const ownerNames = [
  "Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sneha Desai", "Vijay Singh",
  "Kavita Reddy", "Suresh Joshi", "Anita Mehta", "Ravi Gupta", "Neha Kapoor",
  "Manoj Yadav", "Pooja Agarwal", "Sanjay Verma", "Rekha Iyer", "Arun Nair"
];

const occupierNames = [
  "Self", "Tenant A", "Tenant B", "Commercial Tenant", "Residential Tenant",
  "Family Member", "Rented", "Leased", "Owner", "Occupied"
];

const propertyTypes = [
  "Residential Flat", "Commercial Shop", "Office Space", "Residential Bungalow",
  "Industrial Unit", "Mixed Use Building", "Apartment", "Villa", "Warehouse", "Showroom"
];

const zones = ["Zone-1", "Zone-2", "Zone-3", "Zone-4", "Zone-5"];
const wards = ["Ward-A", "Ward-B", "Ward-C", "Ward-D", "Ward-E", "Ward-F"];

const streets = [
  "MG Road", "Station Road", "Gandhi Chowk", "Main Street", "Lake View Road",
  "Market Area", "Industrial Estate", "Residential Colony", "Commercial Complex", "City Center"
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSubProperties(count: number): SubProperty[] {
  const subProps: SubProperty[] = [];
  for (let i = 0; i < count; i++) {
    const area = getRandomNumber(400, 1200);
    const taxableArea = Math.floor(area * 0.9);
    const previousTax = getRandomNumber(5000, 25000);
    const revisedTax = Math.floor(previousTax * (1 + Math.random() * 0.3));
    
    subProps.push({
      id: `sub-${i}-${Date.now()}-${Math.random()}`,
      unitNumber: `Unit-${String.fromCharCode(65 + i)}`,
      unitType: getRandomItem(["Flat", "Office", "Shop", "Godown"]),
      ownerName: getRandomItem(ownerNames),
      occupierName: getRandomItem(occupierNames),
      floor: getRandomItem(["Ground", "1st", "2nd", "3rd", "4th", "5th"]),
      area,
      taxableArea,
      previousTax,
      revisedTax,
    });
  }
  return subProps;
}

export function generateMockProperties(stage: WorkflowStage, count: number = 100): Property[] {
  const properties: Property[] = [];
  
  for (let i = 0; i < count; i++) {
    const zone = getRandomItem(zones);
    const ward = getRandomItem(wards);
    const propertyNumber = `${zone}/${ward}/${String(i + 1).padStart(4, '0')}`;
    const isComplex = Math.random() > 0.7;
    const nature = getRandomItem<Property['nature']>(["Residential", "Commercial", "Industrial", "Mixed", "Open Plot"]);
    const builtUpArea = getRandomNumber(500, 5000);
    const previousTax = getRandomNumber(10000, 100000);
    const revisedTax = Math.floor(previousTax * (1 + Math.random() * 0.4));
    
    const property: Property = {
      id: `prop-${i}-${Date.now()}-${Math.random()}`,
      propertyNumber,
      zone,
      ward,
      propertyCategory: isComplex ? "Complex" : "Individual",
      propertyType: getRandomItem(propertyTypes),
      ownerName: getRandomItem(ownerNames),
      occupierName: getRandomItem(occupierNames),
      nature,
      address: `${getRandomNumber(1, 999)}, ${getRandomItem(streets)}, ${zone}, ${ward}`,
      builtUpArea,
      previousTax,
      revisedTax,
      status: getRandomItem(["Completed", "In Progress", "Pending Review", "Approved"]),
      documents: [
        {
          type: "image",
          name: `photo-${i}.jpg`,
          url: "#",
          uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        ...(Math.random() > 0.3 ? [{
          type: "pdf" as const,
          name: `plan-${i}.pdf`,
          url: "#",
          uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        }] : []),
      ],
      subProperties: isComplex ? generateSubProperties(getRandomNumber(2, 6)) : undefined,
    };
    
    properties.push(property);
  }
  
  return properties;
}
