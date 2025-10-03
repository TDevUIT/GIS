# IE402 GIS Client Application

This is the client-side application for the IE402 GIS project, built with Next.js and TypeScript.

## PROJECT STRUCTURE

```
clients/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard page
│   ├── maps/              # Maps page  
│   ├── analytics/         # Analytics page
│   ├── reports/           # Reports page
│   ├── incidents/         # Incidents page
│   └── ...
├── components/            # React components organized by feature
│   ├── common/           # Shared components (Header, Footer, Sidebar)
│   ├── dashboard/        # Dashboard-specific components
│   ├── maps/             # Map-related components
│   ├── analytics/        # Analytics components
│   ├── incidents/        # Incident components
│   └── reports/          # Report components
├── services/             # API service classes
│   ├── api.ts           # Base API service
│   ├── trafficService.ts # Traffic data API
│   ├── airQualityService.ts # Air quality API
│   ├── gisService.ts    # GIS-related API
│   └── reportService.ts # Report generation API
├── hooks/                # Custom React hooks
│   ├── useTrafficData.ts # Traffic data hook
│   ├── useAirQuality.ts # Air quality hook
│   └── useGeolocation.ts # Geolocation hook
├── utils/                # Utility functions
│   ├── formatters.ts    # Data formatting utilities
│   ├── validators.ts    # Validation functions
│   └── helpers.ts       # General helper functions
├── types/                # TypeScript type definitions
│   └── index.ts         # Main type definitions
├── constants/            # Application constants
│   ├── index.ts         # Main constants
│   └── districts.ts     # District/location data
├── styles/              # CSS styles
│   └── globals.css      # Global styles with Tailwind
└── lib/                 # Library configurations
    └── index.ts         # Main library exports
```

## FEATURES

- **Dashboard**: Overview of traffic and air quality statistics
- **Interactive Maps**: GIS visualization with ArcGIS integration
- **Analytics**: Data analysis and charts
- **Reports**: Generate and download reports
- **Incidents**: Track and manage incidents
- **Responsive Design**: Mobile-friendly interface

## GETTING STARTED

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy .env.example to .env.local and configure
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ARCGIS_API_KEY=your_arcgis_key
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## TECH STACK

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: ArcGIS Maps SDK for JavaScript
- **State Management**: React Hooks
- **HTTP Client**: Fetch API with custom service classes

## API INTEGRATION

The client communicates with backend services through organized service classes:

- `TrafficService`: Traffic data and incidents
- `AirQualityService`: Environmental monitoring data
- `GisService`: Geographic information and mapping
- `ReportService`: Report generation and management

## DEPLOYMENT

Build for production:
```bash
npm run build
npm start
```

## DEVELOPMENT NOTES

- All components include basic placeholder content with descriptive headings
- Service classes include console.log statements for debugging
- Type definitions cover main data structures
- Utility functions provide common formatting and validation
- Custom hooks handle data fetching and state management
