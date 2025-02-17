import { create } from "zustand";

export type CodeState = {
    codes: Record<string, number>;
};

export type CodeActions = {
    addCode: (code: string, quantity: number) => void;
    removeCode: (code: string) => void;
    updateQuantity: (code: string, quantity: number) => void;
    clearCodes: () => void;
};

export type CodeStore = CodeState & CodeActions;

export const defaultInitState: CodeState = {
    codes: {},
};

export const createCodeStore = (initState: CodeState = defaultInitState) => {
    return create<CodeStore>((set) => ({
        ...initState,
        addCode: (code, quantity) => {
            set((state) => ({
                codes: { ...state.codes, [code]: quantity },
            }));
        },

        removeCode: (code) => {
            set((state) => {
                const { [code]: _, ...remainingCodes } = state.codes;
                return { codes: remainingCodes };
            });
        },

        updateQuantity: (code, quantity) => {
            set((state) => ({
                codes: { ...state.codes, [code]: quantity },
            }));
        },

        clearCodes: () => {
            set({ codes: {} });
        },
    }));
};