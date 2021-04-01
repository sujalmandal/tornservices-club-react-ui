import { createSlice } from '@reduxjs/toolkit';

export const initialSharedState = {
      apiKey: "",
      subscriberType: "",
      tornPlayerName: "",
      tornPlayerId: "",
      playerId: "",
      isLoggedIn: false
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
            }
      }
});

export const wipeSharedState=(dispatch)=>{
      localStorage.removeItem("sharedState");
      dispatch(updateSharedState(initialSharedState));
      setTimeout(()=>{window.location.reload()},1000);
}

export const { updateApiKey, updateSharedState } = sharedStateSlice.actions;
export const selectPlayerInfo = (state) => state.sharedState;
export const selectIsLoggedIn =(state) => state.sharedState.isLoggedIn;

export default sharedStateSlice.reducer;