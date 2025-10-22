import {
    HomeIcon,
    MapIcon,
    MapPinIcon,
    BuildingOffice2Icon,
    DocumentTextIcon,
    LightBulbIcon,
    UsersIcon as UserGroupIcon,
    ExclamationTriangleIcon,
    TruckIcon,
    CloudIcon,
    GlobeEuropeAfricaIcon,
    UsersIcon,
} from '@heroicons/vue/24/outline';

export interface NavigationItem {
    name: string;
    href: string;
    icon: any;
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
    { name: 'Terrains', href: '/terrains', icon: GlobeEuropeAfricaIcon },
    { 
        name: 'Users', 
        href: '/users', 
        icon: UsersIcon, 
        adminOnly: true 
    },
];
