'use client';

import { useState, useEffect } from 'react';
import { useCreateDistrict, useUpdateDistrict } from '@/hooks/api/useDistrictsQuery';
import { District } from '@/types';
import { Save, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface DistrictFormProps {
  district?: District;
  onSuccess?: (district?: District) => void;
  onCancel?: () => void;
}

interface FormData {
  name: string;
  code: string;
  areaKm2: string;
  densityPerKm2: string;
}

interface FormErrors {
  name?: string;
  code?: string;
  areaKm2?: string;
  densityPerKm2?: string;
}

export default function DistrictForm({ district, onSuccess, onCancel }: DistrictFormProps) {
  const isEditMode = !!district;
  const createMutation = useCreateDistrict();
  const updateMutation = useUpdateDistrict();

  const [formData, setFormData] = useState<FormData>({
    name: district?.name || '',
    code: district?.code || '',
    areaKm2: district?.areaKm2?.toString() || '',
    densityPerKm2: district?.densityPerKm2?.toString() || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (district) {
      setFormData({
        name: district.name || '',
        code: district.code || '',
        areaKm2: district.areaKm2?.toString() || '',
        densityPerKm2: district.densityPerKm2?.toString() || '',
      });
    }
  }, [district]);

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Tên quận/huyện là bắt buộc';
        if (value.length < 3) return 'Tên phải có ít nhất 3 ký tự';
        if (value.length > 100) return 'Tên không được quá 100 ký tự';
        return undefined;

      case 'code':
        if (!value.trim()) return 'Mã quận/huyện là bắt buộc';
        if (!/^[A-Z0-9]+$/.test(value)) return 'Mã chỉ được chứa chữ in hoa và số';
        if (value.length < 2) return 'Mã phải có ít nhất 2 ký tự';
        if (value.length > 10) return 'Mã không được quá 10 ký tự';
        return undefined;

      case 'areaKm2':
        if (value && isNaN(parseFloat(value))) return 'Diện tích phải là số';
        if (value && parseFloat(value) <= 0) return 'Diện tích phải lớn hơn 0';
        if (value && parseFloat(value) > 10000) return 'Diện tích không hợp lệ';
        return undefined;

      case 'densityPerKm2':
        if (value && isNaN(parseInt(value))) return 'Mật độ phải là số nguyên';
        if (value && parseInt(value) < 0) return 'Mật độ không được âm';
        if (value && parseInt(value) > 1000000) return 'Mật độ không hợp lệ';
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name as keyof FormData, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof FormData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      code: true,
      areaKm2: true,
      densityPerKm2: true,
    });

    if (!validateForm()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      areaKm2: formData.areaKm2 ? parseFloat(formData.areaKm2) : undefined,
      densityPerKm2: formData.densityPerKm2 ? parseInt(formData.densityPerKm2) : undefined,
    };

    try {
      if (isEditMode && district) {
        await updateMutation.mutateAsync({ id: district.id, data: submitData });
      } else {
        await createMutation.mutateAsync(submitData);
      }
      onSuccess?.(district);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleReset = () => {
    if (district) {
      setFormData({
        name: district.name || '',
        code: district.code || '',
        areaKm2: district.areaKm2?.toString() || '',
        densityPerKm2: district.densityPerKm2?.toString() || '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
        areaKm2: '',
        densityPerKm2: '',
      });
    }
    setErrors({});
    setTouched({});
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isSuccess = createMutation.isSuccess || updateMutation.isSuccess;
  const error = createMutation.error || updateMutation.error;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {isSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-800">
              {isEditMode ? 'Cập nhật thành công!' : 'Tạo mới thành công!'}
            </h4>
            <p className="text-sm text-green-700 mt-1">
              Quận/huyện đã được {isEditMode ? 'cập nhật' : 'tạo'} thành công.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800">Lỗi {isEditMode ? 'cập nhật' : 'tạo mới'}</h4>
            <p className="text-sm text-red-700 mt-1">
              {(error as any)?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.'}
            </p>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Tên quận/huyện <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isPending}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.name && touched.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            } ${isPending ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Nhập tên quận/huyện"
          />
          {errors.name && touched.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Code Field */}
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Mã quận/huyện <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isPending}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors uppercase ${
              errors.code && touched.code
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            } ${isPending ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="VD: Q1, Q3, HM"
          />
          {errors.code && touched.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Chỉ chữ in hoa và số, không dấu</p>
        </div>

        {/* Area Field */}
        <div>
          <label htmlFor="areaKm2" className="block text-sm font-medium text-gray-700 mb-1">
            Diện tích (km²)
          </label>
          <input
            type="number"
            id="areaKm2"
            name="areaKm2"
            value={formData.areaKm2}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isPending}
            step="0.01"
            min="0"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.areaKm2 && touched.areaKm2
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            } ${isPending ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="0.00"
          />
          {errors.areaKm2 && touched.areaKm2 && (
            <p className="mt-1 text-sm text-red-600">{errors.areaKm2}</p>
          )}
        </div>

        {/* Density Field */}
        <div>
          <label htmlFor="densityPerKm2" className="block text-sm font-medium text-gray-700 mb-1">
            Mật độ dân số (người/km²)
          </label>
          <input
            type="number"
            id="densityPerKm2"
            name="densityPerKm2"
            value={formData.densityPerKm2}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isPending}
            min="0"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.densityPerKm2 && touched.densityPerKm2
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            } ${isPending ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="0"
          />
          {errors.densityPerKm2 && touched.densityPerKm2 && (
            <p className="mt-1 text-sm text-red-600">{errors.densityPerKm2}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isEditMode ? 'Đang cập nhật...' : 'Đang tạo...'}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEditMode ? 'Cập nhật' : 'Tạo mới'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={isPending}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Đặt lại
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
            <span>Hủy</span>
          </button>
        )}
      </div>
    </form>
  );
}
