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

export const {login} = notLoggedInViewSlice.actions;
export default notLoggedInViewSlice.reducer;