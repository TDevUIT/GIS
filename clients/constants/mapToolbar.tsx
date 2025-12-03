import {
  Pencil,
  Square,
  Circle,
  MapPin,
  Trash2,
  Triangle,
  Minus,
  Download,
  Upload,
  Home,
  Building2,
  Store,
  Coffee,
  UtensilsCrossed,
  Hospital,
  GraduationCap,
  Church,
  Landmark,
  TreePine,
  Fuel,
  Users,
  User,
  Briefcase,
} from 'lucide-react'

export interface DrawingTool {
  id: string
  icon: React.ReactNode
  label: string
  type: 'polyline' | 'polygon' | 'rectangle' | 'circle' | 'marker' | 'delete' | 'export' | 'import'
}

export interface IconItem {
  id: string
  icon: React.ReactNode
  label: string
  color: string
  iconUrl: string
}

export interface CategoryItem {
  id: string
  icon: React.ReactNode
  label: string
}

export const drawingTools: DrawingTool[] = [
  {
    id: 'marker',
    icon: <MapPin className="w-5 h-5" />,
    label: 'Thêm điểm',
    type: 'marker',
  },
  {
    id: 'polyline',
    icon: <Minus className="w-5 h-5" />,
    label: 'Vẽ đường',
    type: 'polyline',
  },
  {
    id: 'polygon',
    icon: <Triangle className="w-5 h-5" />,
    label: 'Vẽ đa giác',
    type: 'polygon',
  },
  {
    id: 'rectangle',
    icon: <Square className="w-5 h-5" />,
    label: 'Vẽ hình chữ nhật',
    type: 'rectangle',
  },
  {
    id: 'circle',
    icon: <Circle className="w-5 h-5" />,
    label: 'Vẽ hình tròn',
    type: 'circle',
  },
  {
    id: 'delete',
    icon: <Trash2 className="w-5 h-5" />,
    label: 'Xóa hình vẽ',
    type: 'delete',
  },
  {
    id: 'export',
    icon: <Download className="w-5 h-5" />,
    label: 'Xuất dữ liệu',
    type: 'export',
  },
  {
    id: 'import',
    icon: <Upload className="w-5 h-5" />,
    label: 'Nhập dữ liệu',
    type: 'import',
  },
]

export const iconItems: IconItem[] = [
  {
    id: 'default',
    icon: <MapPin className="w-4 h-4" />,
    label: 'Điểm',
    color: '#3b82f6',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  },
  {
    id: 'home',
    icon: <Home className="w-4 h-4" />,
    label: 'Nhà',
    color: '#10b981',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  },
  {
    id: 'building',
    icon: <Building2 className="w-4 h-4" />,
    label: 'Tòa nhà',
    color: '#6366f1',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  },
  {
    id: 'store',
    icon: <Store className="w-4 h-4" />,
    label: 'Cửa hàng',
    color: '#f59e0b',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  },
  {
    id: 'coffee',
    icon: <Coffee className="w-4 h-4" />,
    label: 'Cà phê',
    color: '#92400e',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  },
  {
    id: 'restaurant',
    icon: <UtensilsCrossed className="w-4 h-4" />,
    label: 'Nhà hàng',
    color: '#ef4444',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  },
  {
    id: 'hospital',
    icon: <Hospital className="w-4 h-4" />,
    label: 'Bệnh viện',
    color: '#dc2626',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  },
  {
    id: 'school',
    icon: <GraduationCap className="w-4 h-4" />,
    label: 'Trường',
    color: '#eab308',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  },
  {
    id: 'church',
    icon: <Church className="w-4 h-4" />,
    label: 'Nhà thờ',
    color: '#8b5cf6',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  },
  {
    id: 'landmark',
    icon: <Landmark className="w-4 h-4" />,
    label: 'Địa danh',
    color: '#f97316',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  },
  {
    id: 'park',
    icon: <TreePine className="w-4 h-4" />,
    label: 'Công viên',
    color: '#22c55e',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  },
  {
    id: 'gas',
    icon: <Fuel className="w-4 h-4" />,
    label: 'Xăng',
    color: '#64748b',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  },
]

export const categoryItems: CategoryItem[] = [
  {
    id: 'community',
    icon: <Users className="w-4 h-4" />,
    label: 'Cộng đồng',
  },
  {
    id: 'religious',
    icon: <Church className="w-4 h-4" />,
    label: 'Tôn giáo',
  },
  {
    id: 'personal',
    icon: <User className="w-4 h-4" />,
    label: 'Cá nhân',
  },
  {
    id: 'buildings',
    icon: <Building2 className="w-4 h-4" />,
    label: 'Tòa nhà',
  },
  {
    id: 'business',
    icon: <Briefcase className="w-4 h-4" />,
    label: 'Doanh nghiệp',
  },
]
