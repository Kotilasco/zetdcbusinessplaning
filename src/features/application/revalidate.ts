import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: 0, // Your array of objects with key itemcode
};

const revalidateSlice = createSlice({
    name: "revalidating",
    initialState,
    reducers: {
        revalidatePage(state) {
            state.value += 1;
        },
    },
});

export const { revalidatePage } = revalidateSlice.actions;
export default revalidateSlice.reducer;
