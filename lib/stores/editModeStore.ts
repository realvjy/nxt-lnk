import { create } from 'zustand';

interface EditModeState {
    isEditing: boolean;
    setEditing: (editing: boolean) => void;
    toggleEditing: () => void;
}

export const useEditModeStore = create<EditModeState>((set) => ({
    isEditing: true,
    setEditing: (editing) => set({ isEditing: editing }),
    toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),
}));