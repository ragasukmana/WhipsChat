const initialState = {
  data: [],
  isLoading: false,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'POST_LOGIN_PENDING':
      return {
        ...state,
        isLoading: true,
      };
    case 'POST_LOGIN_REJECT':
      return {
        ...state,
        isLoading: false,
      };
    case 'POST_LOGIN_FULFILLED':
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };
    case 'POST_LOGOUT':
      return {
        ...state,
        isLoading: false,
        data: [],
      };
    case 'POST_REGISTER_PENDING':
      return {
        isLoading: true,
      };
    case 'POST_REGISTER_REJECT':
      return {
        isLoading: false,
      };
    case 'POST_REGISTER_FULFILLED':
      return {
        isLoading: false,
      };
    default:
      return state;
  }
};

export default auth;
