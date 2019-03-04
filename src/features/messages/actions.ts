import { ActionsUnion, createAction } from "@martin_hotell/rex-tils";

export const START1 = "START1";
export const STOP1 = "STOP1";
export const START2 = "START2";
export const STOP2 = "STOP2";
export const STOPALL = "STOPALL";
export const SHOW = "SHOW";
export const HIDE = "HIDE";
export const FOO = "FOO";
export const SEQUENCE = "SEQUENCE";
export const ASYNC = "ASYNC";
export const ERROR = "ERROR";
export const STEP1 = "STEP1";
export const STEP2 = "STEP2";
export const SUCCESS = "SUCCESS";
export const FAILED = "FAILED";

const actions = {
  start1: () => createAction(START1),
  stop1: () => createAction(STOP1),
  start2: () => createAction(START2),
  stop2: () => createAction(STOP2),
  stopall: () => createAction(STOPALL),
  show: () => createAction(SHOW),
  hide: () => createAction(HIDE),
  foo: () => createAction(FOO),
  sequence: () => createAction(SEQUENCE),
  error1: () => createAction(ERROR, "ERROR1"),
  error2: () => createAction(ERROR, "ERROR2"),
  error3: () => createAction(ERROR, "timeout"),
  step1: () => createAction(STEP1),
  step2: () => createAction(STEP2),
  async: () => createAction(ASYNC),
  success: () => createAction(SUCCESS),
  failed: () => createAction(FAILED)
};
export type MessagesAction = ActionsUnion<typeof actions>;

export { actions as messagesActions };
//export { Action as MessagesAction };

export type MessagesState = {
  list: Array<string>;
  visible: boolean;
};

const initialState: MessagesState = {
  list: ["abc", "123", "test"],
  visible: false
};

export const messagesReducer = (
  state: MessagesState = initialState,
  action: MessagesAction
): MessagesState => {
  switch (action.type) {
    case SHOW:
      return {
        ...state,
        visible: true
      };
    case HIDE:
      return {
        ...state,
        visible: false
      };
    default:
      return state;
  }
};

export default messagesReducer;
