import { combineReducers } from "redux";
import answerReducer from "../features/answers/actions";

const rootReducer = combineReducers({
  answers: answerReducer
});

export default rootReducer;
