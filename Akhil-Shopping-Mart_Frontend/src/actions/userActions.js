import axios from 'axios'
import url from '../App'

import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    NEW_PASSWORD_REQUEST,
    NEW_PASSWORD_SUCCESS,
    NEW_PASSWORD_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    CREATE_USER_ADDRESS_FAIL,
    CREATE_USER_ADDRESS_SUCCESS,
    CREATE_USER_ADDRESS_REQUEST,
    UPDATE_USER_ADDRESS_REQUEST,
    UPDATE_USER_ADDRESS_SUCCESS,
    UPDATE_USER_ADDRESS_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants'

// Login
export const login = (email, password) => async (dispatch) => {
    try {


        console.log("hello user");
        dispatch({ type: LOGIN_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post(`/api/v1/login`, { email, password }, config)

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user
        })

        localStorage.setItem('token', JSON.stringify(data.user.id))
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message
        })
    }
}

// Register user
export const register = (userData) => async (dispatch) => {
    try {

        console.log("hello reogiste")
        dispatch({ type: REGISTER_USER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.post('/api/v1/register', userData, config)
        console.log("hello reogiste")
        dispatch({

            type: REGISTER_USER_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

// Load user
export const loadUser = () => async (dispatch) => {
    try {

        // Get the value of the token cookie
        function getCookieValue(cookieName) {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(`${cookieName}=`)) {
                    return cookie.substring(cookieName.length + 1, cookie.length);
                }
            }
            return '';
        }

        // Retrieve the token cookie value
        const token = getCookieValue('token');


        // Use the token value as needed
        console.log(`Token: ${token}`);
        localStorage.setItem('token', token)

        /////////////////////////////////////////////////////////////////////////////////////////
        dispatch({ type: LOAD_USER_REQUEST });

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        console.log('config',config)
        const { data } = await axios.get('/api/v1/me', config);

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Update profile
export const updateProfile = (userData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PROFILE_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put('/api/v1/me/update', userData, config)

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update password
export const updatePassword = (passwords) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put('/api/v1/password/update', passwords, config)
        console.log(data);
        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}

// Forgot password
export const forgotPassword = (email) => async (dispatch) => {
    try {

        dispatch({ type: FORGOT_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/v1/password/forgot', email, config)

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message
        })

    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}

// Reset password
export const resetPassword = (token, passwords) => async (dispatch) => {
    try {

        dispatch({ type: NEW_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/password/reset/${token}`, passwords, config)

        dispatch({
            type: NEW_PASSWORD_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: NEW_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}

// Logout user
export const logout = () => async (dispatch) => {
    try {

        await axios.get('/api/v1/logout')

        dispatch({
            type: LOGOUT_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response.data.message
        })
    }
}

// Get all users
export const allUsers = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_USERS_REQUEST })

        const { data } = await axios.get('/api/v1/admin/users')

        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users
        })

    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update user - ADMIN
export const updateUser = (id, userData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_USER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/admin/user/${id}`, userData, config)

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

// Get user details - ADMIN
export const getUserDetails = (id) => async (dispatch) => {
    try {

        dispatch({ type: USER_DETAILS_REQUEST })


        const { data } = await axios.get(`/api/v1/admin/user/${id}`)

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Delete user - ADMIN
export const deleteUser = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_USER_REQUEST })

        const { data } = await axios.delete(`/api/v1/admin/user/${id}`)

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.message
        })
    }
}
export const newUserAddress = (addressData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_USER_ADDRESS_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.put('/api/v1/me/address', addressData, config);

        dispatch({
            type: CREATE_USER_ADDRESS_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatch({
            type: CREATE_USER_ADDRESS_FAIL,
            payload: error.response.data.message,
        });
    }
};

export const updateUserAddress = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: UPDATE_USER_ADDRESS_REQUEST });

        const aid = id.id;
        const address = id.address;
        const city = id.city;
        const postalCode = id.postalCode;
        const phoneNo = id.phoneNo;
        const country = id.country;

        const userData = {
            address,
            city,
            postalCode,
            phoneNo,
            country
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const { data } = await axios.put(`/api/v1/me/address/${aid}`, userData, config);

        dispatch({ type: UPDATE_USER_ADDRESS_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({
            type: UPDATE_USER_ADDRESS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        });
    }
};


// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}