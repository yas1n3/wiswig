import { API_URL } from "../../config/config";

export const login = (mail, password) => async (dispatch) => {
    try {
        const response = await fetch('http://localhost:4000/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({mail, password }),
        });
        const data = await response.json();
        console.log(data)
        if (response.ok) {
            dispatch({ type: "LOGIN_SUCCESS", payload: data });
        } else {
            dispatch({ type: "LOGIN_FAILURE", payload: data });
        }
    } catch (error) {
        dispatch({ type: "LOGIN_FAILURE", payload: error.message });
    }
};
