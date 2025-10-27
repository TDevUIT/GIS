import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">HEADER</h1>
            <p className="text-gray-600">IE402 GIS System</p>
          </div>
          <nav className="flex space-x-6">
            <Link href={ROUTES.DASHBOARD} className="text-gray-600 hover:text-gray-800">Dashboard</Link>
            <Link href={ROUTES.MAPS.INDEX} className="text-gray-600 hover:text-gray-800">Maps</Link>
            <Link href={ROUTES.REPORTS.INDEX} className="text-gray-600 hover:text-gray-800">Reports & Analytics</Link>
            <Link href={ROUTES.INCIDENTS.INDEX} className="text-gray-600 hover:text-gray-800">Incidents</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
