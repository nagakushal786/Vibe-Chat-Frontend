import { createSlice } from "@reduxjs/toolkit";

const initialState={
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    token: "",
    onlineUser: [],
    socketConnection: null
}

export const userSlice=createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, actions)=> {
            state._id=actions.payload._id;
            state.name=actions.payload.name;
            state.email=actions.payload.email;
            state.profile_pic=actions.payload.profile_pic;
        },
        setToken: (state, actions)=> {
            state.token=actions.payload;
        },
        clearUser: (state, actions)=> {
            state._id="";
            state.name="";
            state.email="";
            state.profile_pic="";
            state.token="";
            state.socketConnection=null
        },
        setOnlineUser: (state, actions)=> {
            state.onlineUser=actions.payload
        },
        setSocketConnection: (state, actions)=> {
            state.socketConnection=actions.payload
        }
    }
})

export const {setUser, setToken, clearUser, setOnlineUser, setSocketConnection}=userSlice.actions;

const userReducer=userSlice.reducer;

export default userReducer;