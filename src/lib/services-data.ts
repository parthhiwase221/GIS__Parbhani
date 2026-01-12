export interface ServiceItem {
  title: string;
  subtitle: string;
  icon: string;
  href: string;
  keywords: string;
}

export interface ServiceCategory {
  key: string;
  title: string;
  subtitle: string;
  keywords: string;
  angle: number;
  gradient: string;
  items: ServiceItem[];
  dashboardComponent?: string;
}

// Property Tax Dashboard Modules
export const serviceCategories: ServiceCategory[] = [
  {
    key: 'assessment',
    title: 'Assessment',
    subtitle: 'Dashboard',
    keywords: 'assessment property valuation data center',
    angle: 0,
    gradient: 'g1',
    dashboardComponent: 'assessment',
    items: [
      { title: 'Total Properties', subtitle: 'View all properties', icon: 'fa-building', href: '#assessment', keywords: 'properties' },
      { title: 'Pending Assessments', subtitle: 'Review pending', icon: 'fa-clock', href: '#assessment', keywords: 'pending' },
      { title: 'Completed Today', subtitle: 'Daily progress', icon: 'fa-check-circle', href: '#assessment', keywords: 'completed' },
    ]
  },
  {
    key: 'collection',
    title: 'Collection',
    subtitle: 'Dashboard',
    keywords: 'collection payment revenue tax',
    angle: 60,
    gradient: 'g2',
    dashboardComponent: 'collection',
    items: [
      { title: 'Total Revenue', subtitle: 'Current year', icon: 'fa-rupee-sign', href: '#collection', keywords: 'revenue' },
      { title: 'Pending Collections', subtitle: 'Outstanding amount', icon: 'fa-money-bill-wave', href: '#collection', keywords: 'pending' },
      { title: 'Collection Rate', subtitle: 'Performance metrics', icon: 'fa-chart-line', href: '#collection', keywords: 'rate' },
    ]
  },
  {
    key: 'grievance',
    title: 'Grievance',
    subtitle: 'Management',
    keywords: 'grievance complaint support help',
    angle: 120,
    gradient: 'g3',
    dashboardComponent: 'resolveone',
    items: [
      { title: 'Total Complaints', subtitle: 'All grievances', icon: 'fa-clipboard-list', href: '#grievance', keywords: 'complaints' },
      { title: 'Pending Resolution', subtitle: 'Open cases', icon: 'fa-hourglass-half', href: '#grievance', keywords: 'pending' },
      { title: 'Resolved Today', subtitle: 'Daily closure', icon: 'fa-check-double', href: '#grievance', keywords: 'resolved' },
    ]
  },
  {
    key: 'gis',
    title: 'GIS Property',
    subtitle: 'Tax Dashboard',
    keywords: 'gis map spatial location geography',
    angle: 180,
    gradient: 'g4',
    dashboardComponent: 'gis',
    items: [
      { title: 'Map View', subtitle: 'Spatial overview', icon: 'fa-map-marked-alt', href: '#gis', keywords: 'map' },
      { title: 'Zone Analysis', subtitle: 'Area wise data', icon: 'fa-layer-group', href: '#gis', keywords: 'zones' },
      { title: 'Property Locator', subtitle: 'Find properties', icon: 'fa-search-location', href: '#gis', keywords: 'search' },
    ]
  },
  {
    key: 'rtis',
    title: 'RTIS Services',
    subtitle: 'Dashboard',
    keywords: 'rtis information transparency right',
    angle: 240,
    gradient: 'g5',
    dashboardComponent: 'rtis',
    items: [
      { title: 'Total Requests', subtitle: 'RTI applications', icon: 'fa-file-alt', href: '#rtis', keywords: 'requests' },
      { title: 'Pending Response', subtitle: 'Open requests', icon: 'fa-inbox', href: '#rtis', keywords: 'pending' },
      { title: 'Processed Today', subtitle: 'Daily progress', icon: 'fa-check', href: '#rtis', keywords: 'processed' },
    ]
  },
  {
    key: 'master',
    title: 'Master',
    subtitle: 'Dashboard',
    keywords: 'master overview analytics all combined',
    angle: 300,
    gradient: 'g6',
    dashboardComponent: 'master',
    items: [
      { title: 'Unified Overview', subtitle: 'All modules', icon: 'fa-th-large', href: '#master', keywords: 'overview' },
      { title: 'Performance Analytics', subtitle: 'Cross-module insights', icon: 'fa-chart-pie', href: '#master', keywords: 'analytics' },
      { title: 'Comprehensive Reports', subtitle: 'Combined data', icon: 'fa-file-contract', href: '#master', keywords: 'reports' },
    ]
  }
];

// Fill items with "Coming soon" placeholders if less than 15
serviceCategories.forEach(category => {
  while (category.items.length < 15) {
    category.items.push({
      title: 'Coming soon',
      subtitle: 'More services',
      icon: 'fa-ellipsis',
      href: '#',
      keywords: 'coming soon'
    });
  }
});