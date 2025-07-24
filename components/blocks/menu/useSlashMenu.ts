// components/blocks/menu/useSlashMenu.ts
import { useState, useCallback } from "react";
import { slashMenuItems, SlashMenuItem } from "./menuConfig";

export function useSlashMenu() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(0);

    const filtered = query
        ? slashMenuItems.filter(item =>
            item.search.includes(query.toLowerCase())
        )
        : slashMenuItems;

    const openMenu = useCallback(() => setOpen(true), []);
    const closeMenu = useCallback(() => setOpen(false), []);

    const moveSelection = useCallback(
        (dir: 1 | -1) => {
            setSelected(prev => {
                const next = prev + dir;
                if (next < 0) return filtered.length - 1;
                if (next >= filtered.length) return 0;
                return next;
            });
        },
        [filtered.length]
    );

    const reset = useCallback(() => {
        setQuery("");
        setSelected(0);
        setOpen(false);
    }, []);

    return {
        open,
        query,
        setQuery,
        selected,
        setSelected,
        filtered,
        openMenu,
        closeMenu,
        moveSelection,
        reset,
    };
}