// hooks/useNotification.ts
import { useCallback } from 'react';
import { toast } from 'sonner'; // Ensure this is the correct import

export const useNotification = () => {
    const notify = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
        // Adjust the toast call to match the expected properties
        switch (type) {
            case 'success':
                toast.success(message); // Use the correct method if available
                break;
            case 'error':
                toast.error(message); // Use the correct method if available
                break;
            case 'info':
            default:
                toast(message); // Default method if no type is needed
                break;
        }
    }, []);

    return { notify };
};