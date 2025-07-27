import { useEditModeStore } from '@/lib/stores/editModeStore';
import { Button } from '@/components/ui/button';

const EditModeToggle = () => {
    const { isEditing, toggleEditing } = useEditModeStore();
    return (
        <Button onClick={toggleEditing} variant="outline" size="sm">
            {isEditing ? 'Switch to View Mode' : 'Switch to Edit Mode'}
        </Button>
    );
};