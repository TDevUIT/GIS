import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function Sidebar() {
  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">SIDEBAR</h2>
        <p className="text-gray-400 text-sm">Navigation Menu</p>
      </div>
      
      <nav className="space-y-2">
        <Link href={ROUTES.DASHBOARD} className="block p-3 rounded bg-gray-800 hover:bg-gray-700">
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link href={ROUTES.MAPS.INDEX} className="block p-3 rounded hover:bg-gray-800">
          <span className="font-medium">Maps</span>
        </Link>
        <Link href={ROUTES.ANALYTICS.INDEX} className="block p-3 rounded hover:bg-gray-800">
          <span className="font-medium">Analytics</span>
        </Link>
        <Link href={ROUTES.REPORTS.INDEX} className="block p-3 rounded hover:bg-gray-800">
          <span className="font-medium">Reports</span>
        </Link>
        <Link href={ROUTES.INCIDENTS.INDEX} className="block p-3 rounded hover:bg-gray-800">
          <span className="font-medium">Incidents</span>
        </Link>
      </nav>
      
      <div className="mt-8 pt-8 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          <p>System Status</p>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
