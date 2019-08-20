import { combineReducers } from "redux";
import answerReducer from "../features/answers/redux";
import { StateType } from "typesafe-actions";

const rootReducer = combineReducers({
  answers: answerReducer
});

export default rootReducer;
export type RootState = StateType<typeof rootReducer>;
