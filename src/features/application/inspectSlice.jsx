import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Your array of objects with key itemcode
};

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    updateItemState: (state, action) => {
      const { itemCode, newState, comment } = action.payload;
      const itemToUpdate = state.items.find(
        (item) => item.itemcode === itemCode
      );
      if (itemToUpdate) {
        itemToUpdate.approval = newState;
        if (newState === "REJECTED") {
          itemToUpdate.comment = comment;
        } else {
          itemToUpdate.comment = ""; // Clear comment if state is not rejected
        }
      }
    },
  },
});

export const { updateItemState } = itemsSlice.actions;
export default itemsSlice.reducer;
