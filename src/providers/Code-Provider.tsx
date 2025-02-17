// src/providers/counter-store-provider.tsx
"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

import { type CodeStore, createCodeStore } from "@/store/code";

export const CodeStoreContext = createContext<StoreApi<CodeStore> | null>(null);

export interface CodeStoreProviderProps {
  children: ReactNode;
}

export const CodeStoreProvider = ({ children }: CodeStoreProviderProps) => {
  const codeRef = useRef<StoreApi<CodeStore>>();
  if (!codeRef.current) {
    codeRef.current = createCodeStore();
  }

  return (
    <CodeStoreContext.Provider value={codeRef.current}>
      {children}
    </CodeStoreContext.Provider>
  );
};

export const useCodeStore = <T,>(selector: (store: CodeStore) => T): T => {
  const codeStoreContext = useContext(CodeStoreContext);

  if (!codeStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  return useStore(codeStoreContext, selector);
};
