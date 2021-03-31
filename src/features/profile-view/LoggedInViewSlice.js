import { createSlice } from '@reduxjs/toolkit';


export const loggedInViewSlice = createSlice({
    name: 'notLoggedInView',
    initialState: {
        
    },
    reducers: {
      logout: (state,action) => {
        
      }
    },
  });

export const {logout} = loggedInViewSlice.actions;
export default loggedInViewSlice.reducer;