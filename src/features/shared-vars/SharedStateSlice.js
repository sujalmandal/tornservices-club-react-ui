import { createSlice } from '@reduxjs/toolkit';

export const initialSharedState = {
      apiKey: "",
      subscriberType: "",
      tornPlayerName: "",
      tornPlayerId: "",
      playerId: "",
      isLoggedIn: false,
      isLoading : false
};

const getSharedStateFromLocalStorage = function () {
      return localStorage.getItem("sharedState") ? JSON.parse(localStorage.getItem("sharedState")) : initialSharedState;
}

const setSharedStateToLocalStorage = function (sharedCache) {
      localStorage.setItem("sharedState", JSON.stringify(sharedCache));
}

export const sharedStateSlice = createSlice({
      name: 'sharedState',
      initialState: getSharedStateFromLocalStorage(),
      reducers: {
            updateApiKey: (state, action) => {
                  state.apiKey = action.payload;
            },
            updateSharedState: (state, action) => {
                  state = action.payload;
                  setSharedStateToLocalStorage(action.payload);
                  setTimeout(()=>{window.location.reload()},100);
            }
      }
});

export const wipeSharedState=(dispatch)=>{
      localStorage.removeItem("sharedState");
      dispatch(updateSharedState(initialSharedState));
}

export const { updateApiKey, updateSharedState } = sharedStateSlice.actions;
export const selectPlayerInfo = (state) => state.sharedState;
export const selectIsLoading = (state) => state.sharedState.isLoading;
export const selectIsLoggedIn =(state) => state.sharedState.isLoggedIn;

export default sharedStateSlice.reducer;