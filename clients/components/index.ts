// Re-export common components
export * from './common';

// Re-export dashboard components
export { default as StatCard } from './dashboard/StatCard';
export { default as DashboardChart } from './dashboard/DashboardChart';

// Re-export map components
export * from './maps';

// Re-export analytics components
export { default as AnalyticsChart } from './analytics/AnalyticsChart';
export { default as FilterPanel } from './analytics/FilterPanel';

// Re-export incident components
export { default as IncidentCard } from './incidents/IncidentCard';

// Re-export report components
export { default as ReportCard } from './reports/ReportCard';

// Re-export layout components (explicit to avoid conflicts with common)
export { ConditionalLayout, DashboardLayout, MainLayout } from './layout';
// Layout also exports Header and Footer, but we prefer common's navigation components
// Users should import layout Header/Footer directly if needed: import { Header } from '@/components/layout'

// Re-export home components
export * from './home';

// Re-export about components (for convenience)
export { default as AboutHero } from './about/AboutHero';
export { default as ContactForm } from './about/ContactForm';
export { default as CoreValues } from './about/CoreValues';
export { default as MissionVision } from './about/MissionVision';
export { default as ServicesSection } from './about/ServicesSection';
export { default as Statistics } from './about/Statistics';
export { default as TeamList } from './about/TeamList';
export { default as TeamSection } from './about/TeamSection';

// Re-export district components (for convenience)
export * from './districts';
