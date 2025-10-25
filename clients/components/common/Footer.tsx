import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">FOOTER</h3>
            <p className="text-gray-300">IE402 GIS System</p>
            <p className="text-gray-300">Traffic & Environmental Monitoring</p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href={ROUTES.DASHBOARD} className="hover:text-white">Dashboard</Link></li>
              <li><Link href={ROUTES.MAPS.INDEX} className="hover:text-white">Maps</Link></li>
              <li><Link href={ROUTES.ANALYTICS.INDEX} className="hover:text-white">Analytics</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Contact</h4>
            <p className="text-gray-300">University of Information Technology</p>
            <p className="text-gray-300">Ho Chi Minh City, Vietnam</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 IE402 Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
