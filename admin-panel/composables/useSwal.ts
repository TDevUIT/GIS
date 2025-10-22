import Swal, { type SweetAlertOptions } from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

export const useSwal = () => {
    const swal = Swal.mixin({
        background: '#1F2937',
        color: '#F9FAFB',
        confirmButtonColor: '#3B82F6',
        cancelButtonColor: '#4B5563',
        heightAuto: false,
    });

    const confirm = (options: SweetAlertOptions) => {
        return swal.fire({
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            ...options,
        });
    };

    const confirmDelete = (itemName: string) => {
        return confirm({
            title: 'Are you sure?',
            text: `You won't be able to revert this! The item "${itemName}" will be permanently deleted.`,
            confirmButtonText: 'Yes, delete it!',
        });
    };

    const toastSuccess = (title: string, text?: string) => {
        swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title,
            text,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    };

    const toastError = (title: string, text?: string) => {
        swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title,
            text,
            showConfirmButton: false,
            timer: 5000,
        });
    };

    return {
        swal,
        confirm,
        confirmDelete,
        toastSuccess,
        toastError,
    };
};
