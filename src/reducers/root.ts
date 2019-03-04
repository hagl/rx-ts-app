import { combineReducers } from "redux";
import messagesReducer from "../features/messages/actions";

const rootReducer = combineReducers({
  messages: messagesReducer
});

export default rootReducer;
