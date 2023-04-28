const initialState = {
    user: null,
    error: null,
    isLoggedIn: false
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                error: null,
                isLoggedIn: true
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                user: null,
                error: action.payload.error,
                isLoggedIn: false

            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                error: null,
                isLoggedIn: false

            };
        default:
            return state;
    }
};

export default userReducer;
