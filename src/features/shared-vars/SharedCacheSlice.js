import { createSlice } from '@reduxjs/toolkit';


export const sharedCacheSlice = createSlice({
    name: 'sharedCache',
    initialState: {
          apiKey: "",
          subscriberType: "",
          tornPlayerName: "transhumanist",
          tornPlayerId: "",
          playerId: "",
          isLoggedIn: false
    },
    reducers: {
      updateApiKey: (state,action) => {
            state.apiKey=action.payload;
      }
    }
  });

  export const {updateApiKey} = sharedCacheSlice.actions;
  export const selectPlayerInfo = (state) => state.sharedCache;

  export default sharedCacheSlice.reducer;