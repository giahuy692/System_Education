import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState:{
        login:{
            currentUser: null, // nếu login thành công sẽ trả về thông tin của api đó
            isFetching: false,
            error: false
        }
    },
    reducers: {
        loginStart: (state) =>{
            state.login.isFetching = true; //đang loading
        },
        loginSuccess: (state,action) => {
            state.login.isFetching = false; // đã load xong nên thành false
            state.login.currentUser = action.payload; //tratr lại cho mình tất cả thông tin về người dùng
            state.login.error = false;
        },
        loginFailed: (state) =>{
            state.login.isFetching = false;
            state.login.error = true;
        }
    }
});

export const {
    loginStart,
    loginSuccess,
    loginFailed
} = authSlice.actions;

export default authSlice.reducer;