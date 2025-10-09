import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

export const useSwal = () => {
    const swal = Swal.mixin({
        background: '#1F2937',
        color: '#F9FAFB',
        confirmButtonColor: '#3B82F6',
        cancelButtonColor: '#4B5563',
    });

    const confirmDelete = (itemName: string) => {
        return swal.fire({
            title: 'Are you sure?',
            text: `You won't be able to revert this! The item "${itemName}" will be permanently deleted.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel',
        });
    };

    const toastSuccess = (title: string) => {
        swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title,
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
        confirmDelete,
        toastSuccess,
        toastError,
    };
};
