import { StateType } from "typesafe-actions";
import rootReducer from "./../reducers/root";
import { MessagesState } from "../features/messages/actions";

// export type RootState = StateType<typeof rootReducer>;
export type RootState = {
  messages: MessagesState;
};
