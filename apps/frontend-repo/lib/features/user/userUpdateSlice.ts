import { createAppSlice } from "../../createAppSlice";
import { updateUserData, UpdateUserPayload } from "./userUpdateAPI";

export interface UserUpdateSliceState {
  status: "idle" | "loading" | "failed";
}

const initialState: UserUpdateSliceState = {
  status: "idle",
};

export const userUpdateSlice = createAppSlice({
  name: "update",
  initialState,
  reducers: (create) => ({
    updateUserAsync: create.asyncThunk(
      async ({ token, user }: UpdateUserPayload) => {
        return await updateUserData({ token, user });
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),
  }),

  selectors: {
    selectStatus: (update) => update.status,
  },
});

export const { updateUserAsync } = userUpdateSlice.actions;
export const { selectStatus } = userUpdateSlice.selectors;
