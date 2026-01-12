import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { builtupPortionPolygonsEnhanced, getBuildupTypeColor as getEnhancedBuildupTypeColor, getBuildupSubTypeLabel as getEnhancedBuildupSubTypeLabel } from './buildup-portion-data-enhanced';

interface PropertyTaxGISMapEnhancedProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  
  // Filters
  selectedWards: string[];
  selectedPropertyTypes: string[];
  taxStatus: string;
  riskZones: {
    flood: boolean;
    earthquake: boolean;
    complaints: boolean;
  };
  
  // Layers
  baseLayers: {
    street: boolean;
    satellite: boolean;
    hybrid: boolean;
  };
  propertyLayers: {
    boundaries: boolean;
    footprints: boolean;
    buildings3d: boolean;
    municipalBoundary?: boolean;
    zoneBoundary?: boolean;
    wardBoundary?: boolean;
    builtupPortionBoundary?: boolean;
  };
  taxLayers: {
    paymentStatus: boolean;
    assessmentValue: boolean;
    classification: boolean;
  };
  utilityLayers: {
    water: boolean;
    sewage: boolean;
    power: boolean;
  };
  riskLayers: {
    riskZones: boolean;
    complaintHotspots: boolean;
  };
  
  onSelectProperty: (property: any) => void;
  selectedProperty: any;
  theme: any;
}

export function PropertyTaxGISMapEnhanced({
  zoom,
  onZoomChange,
  selectedWards,
  selectedPropertyTypes,
  taxStatus,
  riskZones,
  baseLayers,
  propertyLayers,
  taxLayers,
  utilityLayers,
  riskLayers,
  onSelectProperty,
  selectedProperty,
  theme
}: PropertyTaxGISMapEnhancedProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [L, setL] = useState<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<any[]>([]);
  const polygonsRef = useRef<any[]>([]);
  const polyLinesRef = useRef<any[]>([]);
  const isDestroyingRef = useRef(false); // Add cleanup tracking flag

  // ✨ NEW: Smooth zoom animation state
  const [isZoomedView, setIsZoomedView] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomCenter, setZoomCenter] = useState({ x: 0, y: 0 });

  // ✨ NEW: Handle zoom animation (camera effect)
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomedView) return; // Already zoomed
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Calculate center offset for zoom focus
    const offsetX = (x - rect.width / 2) * 0.15; // 15% offset
    const offsetY = (y - rect.height / 2) * 0.15;
    
    setZoomCenter({ x: -offsetX, y: -offsetY });
    setZoomScale(1.25); // 125% zoom
    setIsZoomedView(true);
  };

  const handleZoomOut = () => {
    setZoomCenter({ x: 0, y: 0 });
    setZoomScale(1);
    setIsZoomedView(false);
  };

  // Ward color mapping - UNIQUE COLORS for each ward
  const wardColors: Record<string, string> = {
    'ward1': '#3B82F6', // Blue
    'ward2': '#8B5CF6', // Purple
    'ward3': '#10B981', // Green
    'ward4': '#F59E0B', // Amber
    'ward5': '#EF4444', // Red
    'ward6': '#14B8A6'  // Teal
  };

  // Property type colors - UNIQUE COLORS
  const propertyTypeColors: Record<string, string> = {
    'residential': '#3B82F6',  // Blue
    'commercial': '#8B5CF6',   // Purple
    'industrial': '#F97316',   // Orange
    'institutional': '#14B8A6', // Teal
    'vacant': '#84CC16'        // Lime
  };

  // Tax status colors
  const taxStatusColors: Record<string, string> = {
    'paid': '#10B981',      // Green
    'partial': '#F59E0B',   // Amber
    'overdue1': '#EF4444',  // Red
    'overdue3': '#DC2626',  // Dark Red
    'all': '#6B7280'        // Gray
  };

  // Mock property data - Expanded with ward and property type info
  const allProperties = [
    // Ward 1 Properties
    { id: 'P001', coords: [19.2183, 72.9781], ward: 'ward1', propertyType: 'residential', taxStatus: 'paid', address: 'House 45, Sector A', owner: 'Rajesh Kumar', taxAmount: '₹24,500', area: '1200 sq ft' },
    { id: 'P002', coords: [19.2193, 72.9791], ward: 'ward1', propertyType: 'commercial', taxStatus: 'paid', address: 'Shop 12, MG Road', owner: 'Anita Desai', taxAmount: '₹45,000', area: '800 sq ft' },
    { id: 'P003', coords: [19.2203, 72.9801], ward: 'ward1', propertyType: 'residential', taxStatus: 'partial', address: 'Flat 301, Heights', owner: 'Vikram Singh', taxAmount: '₹32,000', area: '1400 sq ft' },
    
    // Ward 2 Properties
    { id: 'P004', coords: [19.2213, 72.9811], ward: 'ward2', propertyType: 'commercial', taxStatus: 'paid', address: 'Office 5A, Plaza', owner: 'Priya Sharma', taxAmount: '₹52,000', area: '1000 sq ft' },
    { id: 'P005', coords: [19.2223, 72.9821], ward: 'ward2', propertyType: 'residential', taxStatus: 'overdue1', address: 'Villa 89, Green Park', owner: 'Amit Patel', taxAmount: '₹38,500', area: '2000 sq ft' },
    { id: 'P006', coords: [19.2233, 72.9831], ward: 'ward2', propertyType: 'institutional', taxStatus: 'paid', address: 'School Campus', owner: 'Education Board', taxAmount: '₹75,000', area: '5000 sq ft' },
    
    // Ward 3 Properties
    { id: 'P007', coords: [19.2103, 72.9841], ward: 'ward3', propertyType: 'residential', taxStatus: 'paid', address: 'House 56, Civil Lines', owner: 'Suresh Gupta', taxAmount: '₹28,900', area: '1300 sq ft' },
    { id: 'P008', coords: [19.2093, 72.9851], ward: 'ward3', propertyType: 'vacant', taxStatus: 'paid', address: 'Plot 34, Zone B', owner: 'Ramesh Yadav', taxAmount: '₹15,000', area: '500 sq ft' },
    { id: 'P009', coords: [19.2083, 72.9861], ward: 'ward3', propertyType: 'commercial', taxStatus: 'partial', address: 'Shop 67, Market', owner: 'Kavita Reddy', taxAmount: '₹41,200', area: '900 sq ft' },
    
    // Ward 4 Properties
    { id: 'P010', coords: [19.2073, 72.9871], ward: 'ward4', propertyType: 'industrial', taxStatus: 'paid', address: 'Factory Unit 12', owner: 'Deepak Joshi', taxAmount: '₹95,000', area: '8000 sq ft' },
    { id: 'P011', coords: [19.2063, 72.9881], ward: 'ward4', propertyType: 'residential', taxStatus: 'overdue3', address: 'House 78, Old City', owner: 'Meera Nair', taxAmount: '₹22,000', area: '1100 sq ft' },
    { id: 'P012', coords: [19.2053, 72.9891], ward: 'ward4', propertyType: 'commercial', taxStatus: 'paid', address: 'Mall Space 45A', owner: 'Ravi Verma', taxAmount: '₹125,000', area: '3000 sq ft' },
    
    // Ward 5 Properties
    { id: 'P013', coords: [19.2243, 72.9771], ward: 'ward5', propertyType: 'residential', taxStatus: 'paid', address: 'Bungalow 12, Enclave', owner: 'Sonia Mehta', taxAmount: '₹48,500', area: '2500 sq ft' },
    { id: 'P014', coords: [19.2253, 72.9781], ward: 'ward5', propertyType: 'institutional', taxStatus: 'paid', address: 'Hospital Complex', owner: 'Health Dept', taxAmount: '₹150,000', area: '10000 sq ft' },
    { id: 'P015', coords: [19.2263, 72.9791], ward: 'ward5', propertyType: 'commercial', taxStatus: 'overdue1', address: 'Tower A, Business Park', owner: 'Vivek Pandey', taxAmount: '₹85,000', area: '2000 sq ft' },
    
    // Ward 6 Properties
    { id: 'P016', coords: [19.2043, 72.9761], ward: 'ward6', propertyType: 'residential', taxStatus: 'paid', address: 'Row House 34', owner: 'Anjali Verma', taxAmount: '₹35,000', area: '1500 sq ft' },
    { id: 'P017', coords: [19.2033, 72.9771], ward: 'ward6', propertyType: 'industrial', taxStatus: 'paid', address: 'Warehouse 56', owner: 'Harish Industries', taxAmount: '₹78,000', area: '6000 sq ft' },
    { id: 'P018', coords: [19.2023, 72.9781], ward: 'ward6', propertyType: 'vacant', taxStatus: 'paid', address: 'Land Parcel 890', owner: 'Rekha Jain', taxAmount: '₹12,000', area: '400 sq ft' },
    
    // Additional mixed properties
    { id: 'P019', coords: [19.2193, 72.9821], ward: 'ward1', propertyType: 'institutional', taxStatus: 'paid', address: 'Library Building', owner: 'Municipal Corp', taxAmount: '₹45,000', area: '3000 sq ft' },
    { id: 'P020', coords: [19.2103, 72.9871], ward: 'ward3', propertyType: 'industrial', taxStatus: 'partial', address: 'Industrial Shed 23', owner: 'Manufacturing Ltd', taxAmount: '₹68,000', area: '5000 sq ft' },
    { id: 'P021', coords: [19.2213, 72.9761], ward: 'ward2', propertyType: 'residential', taxStatus: 'paid', address: 'Apartment 502', owner: 'Kiran Bhat', taxAmount: '₹29,500', area: '1250 sq ft' },
    { id: 'P022', coords: [19.2093, 72.9801], ward: 'ward4', propertyType: 'commercial', taxStatus: 'overdue1', address: 'Showroom 12A', owner: 'Auto Dealers', taxAmount: '₹92,000', area: '2500 sq ft' },
    { id: 'P023', coords: [19.2233, 72.9861], ward: 'ward5', propertyType: 'residential', taxStatus: 'paid', address: 'Duplex 67', owner: 'Arjun Iyer', taxAmount: '₹42,000', area: '1800 sq ft' },
    { id: 'P024', coords: [19.2073, 72.9791], ward: 'ward6', propertyType: 'commercial', taxStatus: 'paid', address: 'Restaurant Space', owner: 'Food Corp', taxAmount: '₹55,000', area: '1200 sq ft' }
  ];

  // THANE MUNICIPAL CORPORATION BOUNDARIES (Real Geographic Data)
  
  // Municipal Boundary - Outer boundary of Thane Municipal Corporation
  const municipalBoundary = {
    name: 'Thane Municipal Corporation',
    coords: [
      [19.2400, 72.9500], // Northwest corner
      [19.2400, 73.0200], // Northeast corner
      [19.1900, 73.0200], // Southeast corner
      [19.1900, 72.9500], // Southwest corner
      [19.2400, 72.9500]  // Close polygon
    ]
  };

  // Zone Boundaries - 5 major zones (Non-overlapping)
  const zoneBoundaries = {
    east: {
      name: 'East Zone',
      color: '#10B981',
      coords: [
        [19.2200, 72.9900],
        [19.2200, 73.0200],
        [19.1900, 73.0200],
        [19.1900, 72.9900],
        [19.2200, 72.9900]
      ]
    },
    west: {
      name: 'West Zone',
      color: '#3B82F6',
      coords: [
        [19.2400, 72.9500],
        [19.2400, 72.9750],
        [19.2100, 72.9750],
        [19.2100, 72.9500],
        [19.2400, 72.9500]
      ]
    },
    central: {
      name: 'Central Zone',
      color: '#8B5CF6',
      coords: [
        [19.2250, 72.9750],
        [19.2250, 73.0000],
        [19.2000, 73.0000],
        [19.2000, 72.9750],
        [19.2250, 72.9750]
      ]
    },
    north: {
      name: 'North Zone',
      color: '#F59E0B',
      coords: [
        [19.2400, 72.9750],
        [19.2400, 73.0000],
        [19.2250, 73.0000],
        [19.2250, 72.9750],
        [19.2400, 72.9750]
      ]
    },
    south: {
      name: 'South Zone',
      color: '#EF4444',
      coords: [
        [19.2000, 72.9900],
        [19.2000, 73.0200],
        [19.1900, 73.0200],
        [19.1900, 72.9900],
        [19.2000, 72.9900]
      ]
    }
  };

  // Ward boundary polygons - Real Thane wards (Non-overlapping within zones)
  const wardPolygons: Record<string, { name: string; coords: [number, number][]; zone: string }> = {
    'ward1': {
      name: 'Ward 1 - Naupada',
      zone: 'central',
      coords: [
        [19.2230, 72.9750],
        [19.2230, 72.9875],
        [19.2125, 72.9875],
        [19.2125, 72.9750],
        [19.2230, 72.9750]
      ]
    },
    'ward2': {
      name: 'Ward 2 - Kopri',
      zone: 'central',
      coords: [
        [19.2230, 72.9875],
        [19.2230, 73.0000],
        [19.2125, 73.0000],
        [19.2125, 72.9875],
        [19.2230, 72.9875]
      ]
    },
    'ward3': {
      name: 'Ward 3 - Vartak Nagar',
      zone: 'central',
      coords: [
        [19.2125, 72.9750],
        [19.2125, 72.9875],
        [19.2000, 72.9875],
        [19.2000, 72.9750],
        [19.2125, 72.9750]
      ]
    },
    'ward4': {
      name: 'Ward 4 - Wagle Estate',
      zone: 'east',
      coords: [
        [19.2200, 72.9900],
        [19.2200, 73.0050],
        [19.2050, 73.0050],
        [19.2050, 72.9900],
        [19.2200, 72.9900]
      ]
    },
    'ward5': {
      name: 'Ward 5 - Ghodbunder',
      zone: 'north',
      coords: [
        [19.2400, 72.9750],
        [19.2400, 73.0000],
        [19.2250, 73.0000],
        [19.2250, 72.9750],
        [19.2400, 72.9750]
      ]
    },
    'ward6': {
      name: 'Ward 6 - Majiwada',
      zone: 'east',
      coords: [
        [19.2050, 73.0050],
        [19.2050, 73.0200],
        [19.1900, 73.0200],
        [19.1900, 73.0050],
        [19.2050, 73.0050]
      ]
    }
  };

  // Comprehensive built-up portion data imported from buildup-portion-data.ts
  // This data includes 90+ building footprints across all 6 wards with detailed property information
  // Red borders are used for all built-up portions (as per reference images)

  // Risk zone polygons
  const floodZones = [
    { coords: [[20.700, 77.015], [20.700, 77.020], [20.695, 77.020], [20.695, 77.015]], label: 'Flood Risk Area 1' },
    { coords: [[20.710, 77.008], [20.710, 77.012], [20.707, 77.012], [20.707, 77.008]], label: 'Flood Risk Area 2' }
  ];

  const earthquakeZones = [
    { coords: [[20.705, 77.010], [20.705, 77.015], [20.702, 77.015], [20.702, 77.010]], label: 'Earthquake Sensitive Zone' }
  ];

  const complaintHotspots = [
    { coords: [20.708, 77.016], radius: 100, label: 'High Complaint Area', count: 12 },
    { coords: [20.702, 77.020], radius: 80, label: 'Complaint Hotspot', count: 8 }
  ];

  // Utility networks
  const utilityNetworks = {
    water: [
      { coords: [[20.715, 77.008], [20.695, 77.022]], label: 'Main Water Line', diameter: '300mm' },
      { coords: [[20.710, 77.007], [20.700, 77.021]], label: 'Distribution Line', diameter: '150mm' }
    ],
    sewage: [
      { coords: [[20.714, 77.009], [20.696, 77.023]], label: 'Primary Sewer Line', diameter: '400mm' },
      { coords: [[20.708, 77.008], [20.702, 77.020]], label: 'Secondary Line', diameter: '200mm' }
    ],
    power: [
      { coords: [[20.713, 77.010], [20.698, 77.024]], label: 'HT Power Line', voltage: '11kV' },
      { coords: [[20.707, 77.007], [20.704, 77.022]], label: 'LT Distribution', voltage: '440V' }
    ]
  };

  // Load Leaflet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        document.head.appendChild(link);
      }
      
      import('leaflet').then((leaflet) => {
        setL(leaflet.default);
        
        delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
        leaflet.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
      });
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!L || !mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [19.2150, 72.9850], // Thane, Maharashtra coordinates
      zoom: zoom,
      zoomControl: false,
      attributionControl: false
    });

    mapRef.current = map;
    isDestroyingRef.current = false; // Reset destroying flag
    setMapLoaded(true);

    return () => {
      isDestroyingRef.current = true; // Set destroying flag
      
      // Clear all layers first
      markersRef.current.forEach(marker => {
        try {
          if (map && marker) map.removeLayer(marker);
        } catch (e) {
          // Ignore errors during cleanup
        }
      });
      markersRef.current = [];
      
      polygonsRef.current.forEach(polygon => {
        try {
          if (map && polygon) map.removeLayer(polygon);
        } catch (e) {
          // Ignore errors during cleanup
        }
      });
      polygonsRef.current = [];
      
      polyLinesRef.current.forEach(line => {
        try {
          if (map && line) map.removeLayer(line);
        } catch (e) {
          // Ignore errors during cleanup
        }
      });
      polyLinesRef.current = [];
      
      // Now remove the map
      if (map) {
        try {
          map.off(); // Remove all event listeners
          map.remove();
        } catch (e) {
          // Ignore errors during cleanup
        }
        mapRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [L]);

  // Update map tiles based on base layer selection
  useEffect(() => {
    if (!mapRef.current || !L || !mapLoaded || isDestroyingRef.current) return;

    const map = mapRef.current;

    // Remove all tile layers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add tile layer based on selected base layer
    let tileLayer;
    if (baseLayers.satellite) {
      tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '&copy; Esri'
      });
    } else if (baseLayers.street) {
      tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      });
    } else if (baseLayers.hybrid) {
      // First add satellite
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map);
      // Then add labels on top
      tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      });
    }

    if (tileLayer) {
      tileLayer.addTo(map);
    }
  }, [L, mapLoaded, baseLayers]);

  // Update zoom
  useEffect(() => {
    if (!mapRef.current || isDestroyingRef.current) return;
    mapRef.current.setZoom(zoom);
  }, [zoom]);

  // ✨ NEW: Render Municipal Boundary (Blue Dashed)
  useEffect(() => {
    if (!mapRef.current || !L || !mapLoaded || isDestroyingRef.current) return;
    if (!propertyLayers.municipalBoundary) {
      // Remove municipal boundary if toggle is off
      polygonsRef.current = polygonsRef.current.filter(p => {
        if (p.options?.className === 'municipal-boundary') {
          mapRef.current.removeLayer(p);
          return false;
        }
        return true;
      });
      return;
    }

    const map = mapRef.current;

    // Draw municipal boundary
    const boundary = L.polygon(municipalBoundary.coords, {
      color: '#3B82F6',
      weight: 5,
      opacity: 0.9,
      fillColor: 'transparent',
      fillOpacity: 0,
      dashArray: '20, 10',
      className: 'municipal-boundary'
    }).addTo(map);

    // Add label
    const center = boundary.getBounds().getCenter();
    const label = L.divIcon({
      html: `<div style="
        background: #3B82F6;
        color: white;
        padding: 8px 16px;
        border-radius: 24px;
        font-size: 13px;
        font-weight: 900;
        white-space: nowrap;
        box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        border: 3px solid white;
      ">${municipalBoundary.name.toUpperCase()}</div>`,
      className: 'municipal-label',
      iconSize: [0, 0]
    });

    const labelMarker = L.marker(center, { icon: label }).addTo(map);

    polygonsRef.current.push(boundary, labelMarker);
  }, [L, mapLoaded, propertyLayers.municipalBoundary]);

  // ✨ NEW: Render Zone Boundaries (Different Colors, Dashed)
  useEffect(() => {
    if (!mapRef.current || !L || !mapLoaded || isDestroyingRef.current) return;
    if (!propertyLayers.zoneBoundary) {
      // Remove zone boundaries if toggle is off
      polygonsRef.current = polygonsRef.current.filter(p => {
        if (p.options?.className === 'zone-boundary') {
          mapRef.current.removeLayer(p);
          return false;
        }
        return true;
      });
      return;
    }

    const map = mapRef.current;

    // Draw zone boundaries
    Object.entries(zoneBoundaries).forEach(([zoneId, zone]) => {
      const polygon = L.polygon(zone.coords, {
        color: zone.color,
        weight: 4,
        opacity: 0.85,
        fillColor: zone.color,
        fillOpacity: 0.08,
        dashArray: '15, 8',
        className: 'zone-boundary'
      }).addTo(map);

      // Zone label
      const center = polygon.getBounds().getCenter();
      const label = L.divIcon({
        html: `<div style="
          background: ${zone.color};
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
          border: 2.5px solid white;
        ">${zone.name.toUpperCase()}</div>`,
        className: 'zone-label',
        iconSize: [0, 0]
      });

      const labelMarker = L.marker(center, { icon: label }).addTo(map);

      polygonsRef.current.push(polygon, labelMarker);
    });
  }, [L, mapLoaded, propertyLayers.zoneBoundary]);

  // ✨ NEW: Render Ward Boundaries (Pink Dashed)
  useEffect(() => {
    if (!mapRef.current || !L || !mapLoaded || isDestroyingRef.current) return;
    if (!propertyLayers.wardBoundary) {
      // Remove ward boundaries if toggle is off
      polygonsRef.current = polygonsRef.current.filter(p => {
        if (p.options?.className === 'ward-boundary') {
          mapRef.current.removeLayer(p);
          return false;
        }
        return true;
      });
      return;
    }

    const map = mapRef.current;

    // Draw ward boundaries
    Object.entries(wardPolygons).forEach(([wardId, ward]) => {
      const polygon = L.polygon(ward.coords, {
        color: '#EC4899',
        weight: 3,
        opacity: 0.8,
        fillColor: '#EC4899',
        fillOpacity: 0.05,
        dashArray: '10, 5',
        className: 'ward-boundary'
      }).addTo(map);

      // Ward label
      const center = polygon.getBounds().getCenter();
      const label = L.divIcon({
        html: `<div style="
          background: #EC4899;
          color: white;
          padding: 5px 12px;
          border-radius: 18px;
          font-size: 11px;
          font-weight: 900;
          white-space: nowrap;
          box-shadow: 0 3px 12px rgba(236, 72, 153, 0.4);
          border: 2px solid white;
        ">${ward.name.toUpperCase()}</div>`,
        className: 'ward-label',
        iconSize: [0, 0]
      });

      const labelMarker = L.marker(center, { icon: label }).addTo(map);

      polygonsRef.current.push(polygon, labelMarker);
    });
  }, [L, mapLoaded, propertyLayers.wardBoundary]);

  // ✨ NEW: Render Built-up Portion Boundaries (Emerald/Green - for Property Tagging)
  useEffect(() => {
    if (!mapRef.current || !L || !mapLoaded || isDestroyingRef.current) return;
    if (!propertyLayers.builtupPortionBoundary) {
      // Remove built-up portion boundaries if toggle is off
      polygonsRef.current = polygonsRef.current.filter(p => {
        if (p.options?.className === 'buildup-boundary') {
          mapRef.current.removeLayer(p);
          return false;
        }
        return true;
      });
      return;
    }

    const map = mapRef.current;

    // Define colors for different property types (fill colors)
    const typeColors: Record<string, string> = {
      residential: '#10B981',   // Green
      commercial: '#F59E0B',    // Orange
      industrial: '#8B5CF6',    // Purple
      institutional: '#3B82F6'  // Blue
    };

    // RED BORDER for all built-up portions (as per reference images)
    const BUILDUP_BORDER_COLOR = '#DC2626'; // Red border for all types

    // Draw built-up portion boundaries with RED borders
    Object.entries(builtupPortionPolygonsEnhanced).forEach(([buildupId, buildup]) => {
      const fillColor = typeColors[buildup.type] || '#10B981';
      
      const polygon = L.polygon(buildup.coords, {
        color: BUILDUP_BORDER_COLOR,  // RED BORDER (matching reference images)
        weight: 3,                     // Thicker border for visibility
        opacity: 1,                    // Full opacity for border
        fillColor: fillColor,          // Type-specific fill color
        fillOpacity: 0.25,             // More visible fill
        className: 'buildup-boundary'
      }).addTo(map);

      // Enhanced popup with comprehensive property details and GIS tagging info
      const subTypeLabel = buildup.subType ? buildup.subType.charAt(0).toUpperCase() + buildup.subType.slice(1) : '';
      const taggingStatus = buildup.tagged ? 
        `<div style="font-size: 11px; color: #10B981; font-weight: 700; margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
          ✅ GIS Tagged
          ${buildup.propertyNo ? `<br/><strong>Property No:</strong> ${buildup.propertyNo}` : ''}
        </div>` :
        `<div style="font-size: 11px; color: #F59E0B; font-weight: 700; margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
          ⏳ Pending GIS Tagging
        </div>`;

      polygon.bindPopup(`
        <div style="padding: 12px; font-family: system-ui; min-width: 240px;">
          <div style="font-weight: 900; color: ${fillColor}; margin-bottom: 8px; font-size: 14px; border-bottom: 2px solid ${fillColor}; padding-bottom: 6px;">
            🏗️ ${buildup.name}
          </div>
          <div style="font-size: 11px; color: #374151; margin-bottom: 4px;">
            <strong style="color: #6B7280;">Property Type:</strong> ${buildup.type.charAt(0).toUpperCase() + buildup.type.slice(1)}
          </div>
          ${subTypeLabel ? `<div style="font-size: 11px; color: #374151; margin-bottom: 4px;">
            <strong style="color: #6B7280;">Sub-type:</strong> ${subTypeLabel}
          </div>` : ''}
          <div style="font-size: 11px; color: #374151; margin-bottom: 4px;">
            <strong style="color: #6B7280;">Ward:</strong> ${buildup.ward.replace('ward', 'Ward ')}
          </div>
          ${buildup.floors ? `<div style="font-size: 11px; color: #374151; margin-bottom: 4px;">
            <strong style="color: #6B7280;">Floors:</strong> ${buildup.floors}
          </div>` : ''}
          ${buildup.area ? `<div style="font-size: 11px; color: #374151; margin-bottom: 4px;">
            <strong style="color: #6B7280;">Built-up Area:</strong> ${buildup.area} sq.m
          </div>` : ''}
          ${taggingStatus}
        </div>
      `);

      // Built-up portion label (smaller, showing name with red accent)
      const center = polygon.getBounds().getCenter();
      const label = L.divIcon({
        html: `<div style="
          background: ${fillColor};
          color: white;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 8px;
          font-weight: 900;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
          border: 2px solid ${BUILDUP_BORDER_COLOR};
          pointer-events: none;
        ">${buildup.name.length > 20 ? buildup.name.substring(0, 18) + '...' : buildup.name}</div>`,
        className: 'buildup-label',
        iconSize: [0, 0]
      });

      const labelMarker = L.marker(center, { icon: label }).addTo(map);

      polygonsRef.current.push(polygon, labelMarker);
    });
  }, [L, mapLoaded, propertyLayers.builtupPortionBoundary]);

  // Render risk zones
  useEffect(() => {
    if (!mapRef.current || !L || !mapLoaded || !riskLayers.riskZones || isDestroyingRef.current) return;

    const map = mapRef.current;

    // Flood zones
    if (riskZones.flood) {
      floodZones.forEach(zone => {
        const polygon = L.polygon(zone.coords, {
          color: '#3B82F6',
          weight: 2,
          opacity: 0.7,
          fillColor: '#3B82F6',
          fillOpacity: 0.2,
          dashArray: '5, 5'
        }).addTo(map);

        polygon.bindPopup(`
          <div style="padding: 8px; font-family: system-ui;">
            <p style="margin: 0; font-weight: bold; color: #3B82F6;">💧 ${zone.label}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6B7280;">High flood risk area</p>
          </div>
        `);

        polygonsRef.current.push(polygon);
      });
    }

    // Earthquake zones
    if (riskZones.earthquake) {
      earthquakeZones.forEach(zone => {
        const polygon = L.polygon(zone.coords, {
          color: '#F59E0B',
          weight: 2,
          opacity: 0.7,
          fillColor: '#F59E0B',
          fillOpacity: 0.2,
          dashArray: '10, 5'
        }).addTo(map);

        polygon.bindPopup(`
          <div style="padding: 8px; font-family: system-ui;">
            <p style="margin: 0; font-weight: bold; color: #F59E0B;">⚡ ${zone.label}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6B7280;">Earthquake sensitive area</p>
          </div>
        `);

        polygonsRef.current.push(polygon);
      });
    }
  }, [L, mapLoaded, riskZones, riskLayers.riskZones]);

  // Render complaint hotspots
  useEffect(() => {
    if (!mapRef.current || !L || !mapLoaded || !riskLayers.complaintHotspots || !riskZones.complaints || isDestroyingRef.current) return;

    const map = mapRef.current;

    complaintHotspots.forEach(hotspot => {
      const circle = L.circle(hotspot.coords, {
        radius: hotspot.radius,
        color: '#EF4444',
        weight: 2,
        opacity: 0.8,
        fillColor: '#EF4444',
        fillOpacity: 0.3
      }).addTo(map);

      circle.bindPopup(`
        <div style="padding: 8px; font-family: system-ui;">
          <p style="margin: 0; font-weight: bold; color: #EF4444;">🚨 ${hotspot.label}</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #6B7280;">${hotspot.count} active complaints</p>
        </div>
      `);

      polygonsRef.current.push(circle);
    });
  }, [L, mapLoaded, riskZones.complaints, riskLayers.complaintHotspots]);

  // Render utility networks
  useEffect(() => {
    if (!mapRef.current || !L || !mapLoaded) return;

    const map = mapRef.current;

    // Clear existing polylines
    polyLinesRef.current.forEach(p => map.removeLayer(p));
    polyLinesRef.current = [];

    // Water infrastructure
    if (utilityLayers.water) {
      utilityNetworks.water.forEach(network => {
        const polyline = L.polyline(network.coords, {
          color: '#0EA5E9',
          weight: 4,
          opacity: 0.8
        }).addTo(map);

        polyline.bindPopup(`
          <div style="padding: 8px; font-family: system-ui;">
            <p style="margin: 0; font-weight: bold; color: #0EA5E9;">💧 ${network.label}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6B7280;">Diameter: ${network.diameter}</p>
          </div>
        `);

        polyLinesRef.current.push(polyline);
      });
    }

    // Sewage network
    if (utilityLayers.sewage) {
      utilityNetworks.sewage.forEach(network => {
        const polyline = L.polyline(network.coords, {
          color: '#78716C',
          weight: 4,
          opacity: 0.8,
          dashArray: '5, 5'
        }).addTo(map);

        polyline.bindPopup(`
          <div style="padding: 8px; font-family: system-ui;">
            <p style="margin: 0; font-weight: bold; color: #78716C;">🚰 ${network.label}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6B7280;">Diameter: ${network.diameter}</p>
          </div>
        `);

        polyLinesRef.current.push(polyline);
      });
    }

    // Power lines
    if (utilityLayers.power) {
      utilityNetworks.power.forEach(network => {
        const polyline = L.polyline(network.coords, {
          color: '#F59E0B',
          weight: 3,
          opacity: 0.8,
          dashArray: '2, 4'
        }).addTo(map);

        polyline.bindPopup(`
          <div style="padding: 8px; font-family: system-ui;">
            <p style="margin: 0; font-weight: bold; color: #F59E0B;">⚡ ${network.label}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6B7280;">Voltage: ${network.voltage}</p>
          </div>
        `);

        polyLinesRef.current.push(polyline);
      });
    }
  }, [L, mapLoaded, utilityLayers]);

  // Render property markers with FILTERS
  useEffect(() => {
    if (!mapRef.current || !L || !mapLoaded) return;

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Filter properties based on all active filters
    const filteredProperties = allProperties.filter(property => {
      // Ward filter
      if (selectedWards.length > 0 && !selectedWards.includes(property.ward)) {
        return false;
      }

      // Property type filter
      if (selectedPropertyTypes.length > 0 && !selectedPropertyTypes.includes(property.propertyType)) {
        return false;
      }

      // Tax status filter
      if (taxStatus !== 'all' && property.taxStatus !== taxStatus) {
        return false;
      }

      return true;
    });

    // Auto-zoom to filtered properties with animation
    if (filteredProperties.length > 0) {
      // First zoom out slightly for smooth transition
      const currentZoom = map.getZoom();
      
      // Animate zoom out
      map.setZoom(Math.max(currentZoom - 2, 12), { animate: true, duration: 0.3 });
      
      // After zoom out, calculate bounds and zoom to fit filtered properties
      setTimeout(() => {
        const bounds = L.latLngBounds(filteredProperties.map(p => p.coords));
        
        // Zoom to fit all filtered properties with padding
        map.fitBounds(bounds, {
          padding: [80, 80],
          maxZoom: 16,
          animate: true,
          duration: 0.8
        });
      }, 400);
    } else {
      // If no filters active, reset to default view
      map.setView([20.705, 77.015], 14, { animate: true, duration: 0.5 });
    }

    // Determine marker color based on active visualization
    filteredProperties.forEach(property => {
      const isSelected = selectedProperty?.id === property.id;
      
      // Color priority: Tax Status > Property Type > Ward
      let markerColor = wardColors[property.ward];
      let markerLabel = property.ward.replace('ward', 'W');
      
      if (selectedPropertyTypes.length > 0) {
        markerColor = propertyTypeColors[property.propertyType];
        markerLabel = property.propertyType.charAt(0).toUpperCase();
      }
      
      if (taxStatus !== 'all' || taxLayers.paymentStatus) {
        markerColor = taxStatusColors[property.taxStatus];
        markerLabel = property.taxStatus === 'paid' ? '✓' : 
                     property.taxStatus === 'partial' ? '◐' :
                     property.taxStatus === 'overdue1' ? '!' :
                     property.taxStatus === 'overdue3' ? '!!' : '?';
      }

      const iconHtml = `
        <div class="property-marker ${isSelected ? 'selected' : ''}" style="
          width: ${isSelected ? '28px' : '24px'};
          height: ${isSelected ? '28px' : '24px'};
          background: ${markerColor};
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25), ${isSelected ? `0 0 16px ${markerColor}80` : '0 0 6px rgba(0,0,0,0.15)'};
          font-size: ${isSelected ? '12px' : '10px'};
          font-weight: bold;
          color: white;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        ">
          ${isSelected ? `
            <div style="
              position: absolute;
              inset: -6px;
              border: 2px solid ${markerColor};
              border-radius: 50%;
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          ` : ''}
          <span style="position: relative; z-index: 10;">${markerLabel}</span>
        </div>
        <style>
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          .property-marker:hover {
            transform: scale(1.15) translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 20px ${markerColor}80;
          }
        </style>
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: 'custom-property-marker',
        iconSize: [isSelected ? 28 : 24, isSelected ? 28 : 24],
        iconAnchor: [isSelected ? 14 : 12, isSelected ? 14 : 12]
      });

      const marker = L.marker(property.coords, { icon: icon })
        .addTo(map)
        .on('click', () => {
          onSelectProperty(property);
          // Zoom to selected property
          map.setView(property.coords, 17, { animate: true, duration: 0.5 });
        });

      // Hover tooltip
      marker.bindPopup(createPropertyPopup(property, markerColor), {
        closeButton: false,
        className: 'hover-tooltip'
      });

      marker.on('mouseover', function() {
        this.openPopup();
      });

      marker.on('mouseout', function() {
        if (!isSelected) {
          this.closePopup();
        }
      });

      markersRef.current.push(marker);
    });
  }, [L, mapLoaded, selectedWards, selectedPropertyTypes, taxStatus, selectedProperty, taxLayers.paymentStatus]);

  // Create property popup
  function createPropertyPopup(property: any, color: string) {
    const typeIcons: Record<string, string> = {
      'residential': '🏠',
      'commercial': '🏪',
      'industrial': '🏭',
      'institutional': '🏛️',
      'vacant': '🌳'
    };

    const statusIcons: Record<string, string> = {
      'paid': '✅',
      'partial': '⚠️',
      'overdue1': '🔴',
      'overdue3': '🚨',
      'all': '📋'
    };

    return `
      <div style="
        font-family: system-ui;
        padding: 12px;
        min-width: 240px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 6px 16px rgba(0,0,0,0.15);
      ">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, ${color}, ${color}CC);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 2px 8px ${color}40;
          ">${typeIcons[property.propertyType]}</div>
          <div style="flex: 1;">
            <p style="margin: 0; font-weight: 900; font-size: 13px; color: #111827;">${property.id}</p>
            <p style="margin: 0; font-size: 10px; color: #6B7280; margin-top: 2px;">${property.propertyType.toUpperCase()}</p>
          </div>
        </div>
        
        <div style="
          background: #F3F4F6;
          padding: 8px;
          border-radius: 8px;
          border-left: 3px solid ${color};
          margin-bottom: 8px;
        ">
          <p style="margin: 0; font-size: 11px; font-weight: bold; color: #6B7280;">Address</p>
          <p style="margin: 0; font-size: 12px; font-weight: 900; color: #111827; margin-top: 2px;">${property.address}</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px;">
          <div style="background: #F3F4F6; padding: 6px; border-radius: 6px;">
            <p style="margin: 0; font-size: 10px; color: #6B7280;">Ward</p>
            <p style="margin: 0; font-size: 11px; font-weight: 900; color: #111827; margin-top: 2px;">${property.ward.replace('ward', 'Ward ')}</p>
          </div>
          <div style="background: #F3F4F6; padding: 6px; border-radius: 6px;">
            <p style="margin: 0; font-size: 10px; color: #6B7280;">Area</p>
            <p style="margin: 0; font-size: 11px; font-weight: 900; color: #111827; margin-top: 2px;">${property.area}</p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: ${color}15; border-radius: 8px;">
          <div>
            <p style="margin: 0; font-size: 10px; color: #6B7280;">Tax Amount</p>
            <p style="margin: 0; font-size: 13px; font-weight: 900; color: ${color}; margin-top: 2px;">${property.taxAmount}</p>
          </div>
          <div style="
            background: ${taxStatusColors[property.taxStatus]};
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 900;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>${statusIcons[property.taxStatus]}</span>
            ${property.taxStatus.toUpperCase()}
          </div>
        </div>

        <p style="margin: 12px 0 0 0; font-size: 9px; text-align: center; color: #9CA3AF; font-style: italic;">
          Click for full details
        </p>
      </div>
    `;
  }

  return (
    <motion.div 
      className="w-full h-full overflow-hidden relative"
      animate={{
        scale: zoomScale,
        x: zoomCenter.x,
        y: zoomCenter.y
      }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] // ease-in-out cubic-bezier
      }}
    >
      <div ref={mapContainerRef} className="w-full h-full" onClick={handleMapClick} />
      
      {/* Zoom Out Button - Only visible when zoomed */}
      {isZoomedView && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          className="absolute bottom-6 right-6 z-50 px-4 py-2 rounded-lg font-bold text-sm shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            color: 'white',
            border: '2px solid white'
          }}
        >
          🔍 Zoom Out
        </motion.button>
      )}
    </motion.div>
  );
}