/**
 * GIS Property Tax Dashboard - Main Application Entry Point
 * 
 * This is the root component of the standalone GIS Property Tax Dashboard
 * for Thane Municipal Corporation. It loads the enhanced GIS dashboard
 * with all interactive features including:
 * 
 * - Interactive GIS map with 6 wards
 * - Real-time analytics and statistics
 * - Advanced filtering and search
 * - Export functionality
 * - Ward comparison tools
 * - Heat map visualization
 * 
 * @version 1.0.0
 * @author Thane Municipal Corporation
 */

import { GISPropertyTaxDashboardEnhancedFinal } from './components/dashboards/GISPropertyTaxDashboardEnhancedFinal';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <GISPropertyTaxDashboardEnhancedFinal />
    </div>
  );
}