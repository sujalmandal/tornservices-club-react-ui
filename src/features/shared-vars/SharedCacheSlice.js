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
    reducers: {}
  });

  export default sharedCacheSlice.reducer;