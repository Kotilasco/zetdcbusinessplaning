// src/store.ts

import { create } from 'zustand';
import { produce } from 'immer';

type State = {
    address: string;
    email: string;
    firstname: string;
    idNum: string;
    item: string;
    lastname: string;
    msg: string;
    phone: string;
    reference: string;
    referenceNo: string;
    title: string;
    typeOfId: string;
    work: string;
    totalPrice: number;
};

type Store = {
    state: State;
    setValues: (values: Partial<State>) => void;
    clearState: () => void;
};

export const useStore = create<Store>((set) => ({
    state: {
        address: '',
        email: '',
        firstname: '',
        idNum: '',
        item: '',
        lastname: '',
        msg: '',
        phone: '',
        reference: '',
        referenceNo: '',
        title: '',
        typeOfId: '',
        work: '',
        totalPrice: 0
    },
    setValues: (values) =>
        set((state) => ({
            state: { ...state.state, ...values },
        })),
    clearState: () =>
        set((state) => ({
            state: {
                address: '',
                email: '',
                firstname: '',
                idNum: '',
                item: '',
                lastname: '',
                msg: '',
                phone: '',
                reference: '',
                referenceNo: '',
                title: '',
                typeOfId: '',
                work: '',
                totalPrice: 0,
            },
        })),
}));
