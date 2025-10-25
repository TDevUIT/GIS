import { LocationData } from '@/types/map'

export const MAP_LOCATIONS: LocationData[] = [
  {
    name: 'Thành phố Thủ Đức',
    address: 'Khu đô thị mới phía Đông, TP.HCM',
    info: 'Thành phố trực thuộc thành phố đầu tiên của Việt Nam',
    coordinates: [10.8505, 106.7717],
  },
  {
    name: 'Quận 1',
    address: 'Trung tâm Thành phố Hồ Chí Minh',
    info: 'Trung tâm tài chính, thương mại lớn nhất thành phố',
    coordinates: [10.7756, 106.7019],
  },
  {
    name: 'Bến Thành Market',
    address: 'Lê Lợi, Phường Bến Thành, Quận 1',
    info: 'Chợ truyền thống nổi tiếng của TP.HCM',
    coordinates: [10.7720, 106.6980],
  },
]

export const DEFAULT_MAP_CENTER: [number, number] = [10.8231, 106.6297]
export const DEFAULT_MAP_ZOOM = 13
