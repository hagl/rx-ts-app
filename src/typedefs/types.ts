import { StateType } from "typesafe-actions";
import rootReducer from "../reducers/root";

export type RootState = StateType<typeof rootReducer>;

