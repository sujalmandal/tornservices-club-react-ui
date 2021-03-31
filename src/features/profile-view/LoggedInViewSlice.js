import { createSlice } from '@reduxjs/toolkit';


export const notLoggedInViewSlice = createSlice({
    name: 'notLoggedInView',
    initialState: {
        
    },
    reducers: {
      login: (state,action) => {
        
      }
    },
  });

export const selectPlayerInfo = (state) => state.sharedCache;

export const {login,register} = notLoggedInViewSlice.actions;
export default notLoggedInViewSlice.reducer;