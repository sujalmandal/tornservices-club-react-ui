import { createSlice } from '@reduxjs/toolkit';


export const registrationLoginSlice = createSlice({
    name: 'registrationLogin',
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

export const selectPlayerInfo = (state) => state.registrationLogin.player;

export const {login,register} = registrationLoginSlice.actions;
export default registrationLoginSlice.reducer;