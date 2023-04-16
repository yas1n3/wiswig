const initialState = {
    user: null,
    error: null
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                error: null
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                user: null,
                error: action.payload.error
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                error: null
            };
        default:
            return state;
    }
};

export default userReducer;
