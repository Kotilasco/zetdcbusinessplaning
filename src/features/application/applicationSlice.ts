//@ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ItemsState {
    itemCode: string | undefined;
    description: string | undefined;
    quantity: number;
    unitOfMeasure: string | undefined;
    price: number | undefined;
    status: string | undefined;
    reason: string | undefined;
}

export interface submitState {
    itemCode: string | undefined;
    status: string | undefined;
    reason: string | undefined;
}



type State = {
    address: string;
    email: string;
    firstname: string;
    nationalId: string;
    lastname: string;
    msg: string;
    phoneNumber: string;
    referenceType: string;
    referenceNo: string;
    title: string;
    identificationType: string;
    jobType: string;
    status: string;
    district: string;
    applicationLineItemsDtoList: ItemsState[];
    totalPrice: number;
    submitItems: submitState[];
}

export interface ApplicationState {
    values: State;
}

export interface AddItemsState {
    applicationLineItemsDtoList: ItemsState[]
}

const initialState: ApplicationState = {
    values: {
        suburb: '',
        houseNo: '',
        email: '',
        firstname: '',
        nationalId: '',
        lastname: '',
        msg: '',
        depot: '',
        region: '',
        phoneNumber: '',
        referenceType: '',
        referenceNo: '',
        status: "PENDING",
        title: '',
        identificationType: '',
        jobType: '',
        district: '',
        applicationLineItemsDtoList: [],
        totalPrice: 0,
        submitItems: []
    }
};


function calculateTotalPrice(itemsAdded: ItemsState[]) {
    let total_price: number = 0;
    for (let i = 0; i < itemsAdded.length; i++) {
        const item = itemsAdded[i];
        const subtotal = item?.price * item.quantity;
        total_price += subtotal;
    }

    return total_price;
}

export const applicationSlice = createSlice({
    name: "application",
    initialState,
    reducers: {
        updateValues: (state, action: PayloadAction<Partial<ApplicationState['values']>>) => {
            state.values = { ...state.values, ...action.payload };
            state.values.totalPrice = calculateTotalPrice(state.values.applicationLineItemsDtoList)
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            const itemsCodeToDelete = action.payload;
            state.values.applicationLineItemsDtoList = state.values.applicationLineItemsDtoList.filter(
                item => item.itemCode !== itemsCodeToDelete
            );

            state.values.totalPrice = calculateTotalPrice(state.values.applicationLineItemsDtoList)
        },
        resetValues: (state) => {
            state.values = { ...initialState.values };
        },
        addItem: (state, action: PayloadAction<ItemsState>) => {
            const newItem = action.payload;
            const existingItemIndex = state.values.applicationLineItemsDtoList.findIndex(
                item => item.itemCode === newItem.itemCode
            );

            if (existingItemIndex !== -1) {
                state.values.applicationLineItemsDtoList[existingItemIndex].quantity = newItem.quantity;
            } else {
                state.values.applicationLineItemsDtoList.push(newItem);
            }
            state.values.totalPrice = calculateTotalPrice(state.values.applicationLineItemsDtoList)
        },
        addStatus: (state, action: PayloadAction<submitState>) => {
            const newItem = action.payload;
            const existingItemIndex = state.values.submitItems.findIndex(
                item => item.itemCode === newItem.itemCode
            );

            if (existingItemIndex !== -1) {
                state.values.submitItems[existingItemIndex].status = newItem.status;
            } else {
                state.values.submitItems.push(newItem);
            }
        },
    },
});

// Action creators are generated for each case reducer function
export const { updateValues, deleteItem, resetValues, addItem, addStatus } = applicationSlice.actions;

export default applicationSlice.reducer;
