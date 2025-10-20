import {
    HomeIcon,
    UsersIcon,
    MapIcon,
    MapPinIcon,
    BuildingOffice2Icon,
    UserGroupIcon,
    GlobeAltIcon,
    CloudIcon,
    BeakerIcon,
    RadioIcon,
    ExclamationTriangleIcon,
    TruckIcon,
    DocumentTextIcon,
    LightBulbIcon,
    ChartBarIcon,
} from '@heroicons/vue/24/outline';
import { shallowRef } from 'vue';
import type { FunctionalComponent } from 'vue';

export interface NavigationItem {
    name: string;
    href: string;
    icon: FunctionalComponent;
    adminOnly?: boolean;
}

export const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Districts', href: '/districts', icon: MapIcon },
    { name: 'Wards', href: '/wards', icon: MapPinIcon },
    { name: 'Infrastructures', href: '/infrastructures', icon: BuildingOffice2Icon },
    { name: 'Land Uses', href: '/land-uses', icon: DocumentTextIcon },
    { name: 'Urban Plans', href: '/urban-plans', icon: LightBulbIcon },
    { name: 'Populations', href: '/populations', icon: UserGroupIcon },
    { name: 'Traffics', href: '/traffics', icon: ExclamationTriangleIcon },
    { name: 'Public Transports', href: '/public-transports', icon: TruckIcon },
    { name: 'Environment', href: '/environment', icon: CloudIcon },
    { name: 'Terrains', href: '/terrains', icon: GlobeAltIcon },
    { name: 'Users', href: '/users', icon: UsersIcon, adminOnly: true },
];
