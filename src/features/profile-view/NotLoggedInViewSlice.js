import { createSlice } from '@reduxjs/toolkit';


export const notLoggedInViewSlice = createSlice({
    name: 'notLoggedInView',
    initialState: {
        "player":{
          apiKey: "",
          subscriberType: "",
          tornPlayerName: "",
          tornPlayerId: "",
          playerId: "",
          isLoggedIn: false
      }
    },
    reducers: {
      login: (state,action) => {
        
      },
      register: (state,action) => {
        
      }
    },
  });

  export const selectPlayerInfo = (state) => state.sharedCache;

export const {login,register} = notLoggedInViewSlice.actions;
export default notLoggedInViewSlice.reducer;