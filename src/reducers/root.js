
const initialState = {
  messages: {
    list: ['abc', '123', 'test']
  },
  isLoading: false,
  error: false
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
      default:
          return state;
  }
}