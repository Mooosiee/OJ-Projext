import {createSlice} from '@reduxjs/toolkit';
const initialState = {
    user: null,
    error: null,
};
const userSlice = createSlice({
    name: 'user',           
    initialState,
    reducers: {
        SigninSuccess: (state, action) => {
            //what is state?
            // state is the current state of the user slice
            //what is user slice?
            // The user slice is a part of the Redux store that manages user-related data
            //basically user slice gives us current state globally? yes or no
            //yes, it provides a way to manage and access user-related data across the application
            //which not possible with useState?
            // Yes, using Redux allows for a global state management solution that can be accessed from any component
            //because useState is local to the component?
            // Yes, useState is local to the component and does not provide a way to share state across components
            // to share state of what? what kind of data? only user?
            state.user = action.payload; //action.paylod contains the user data from the server 
            state.error = null; // Reset error when setting user
        },
        SignInFailure: (state, action) => {
            state.error = action.payload; // Set error message
        },
        UpdateUserSuccess:(state,action) =>{
            state.user = action.payload; // Update the current user with the new data
            state.error = null; // Reset error when updating user
        },
        UpdateUserFailure:(state,action) =>{
            state.error = action.payload; // Set error message when updating user fails
        },
        DeleteUserSuccess:(state,action) =>{
            state.user = null; // Clear current user on successful deletion
            state.error = null; // Reset error when deleting user
        },
        DeleteUserFailure:(state,action) =>{
            state.error = action.payload; // Set error message when deleting user fails
        }
    }

});
export const { SigninSuccess, SignInFailure,UpdateUserSuccess,UpdateUserFailure,DeleteUserSuccess,DeleteUserFailure } = userSlice.actions; // Export actions for use in components
export default userSlice.reducer; // Export the reducer to be used in the store
//what is store?
// The store is the central place where the application's state is stored in Redux
// It holds the state tree of the application and allows components to access and update the state 