import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';
import { object } from 'prop-types';
import { create } from 'domain';

export const START1 = 'START1';
export const STOP1 = 'STOP1';
export const START2 = 'START2';
export const STOP2 = 'STOP2';
export const STOPALL = 'STOPALL';
export const SHOW = 'SHOW';
export const HIDE = 'HIDE';
export const FOO = 'FOO';
export const SEQUENCE = 'SEQUENCE';
export const ASYNC = 'ASYNC';
export const ERROR = 'ERROR';
export const STEP1 = 'STEP1';
export const STEP2 = 'STEP2';
export const SUCCESS = 'SUCCESS';
export const FAILED = 'FAILED';
export const INFO = 'INFO';

export const START_ARRAY_SPREAD = 'START_ARRAY_SPREAD';
export const START_ARRAY_CONCAT = 'START_ARRAY_CONCAT';
export const START_ARRAY_PUSH = 'START_ARRAY_PUSH';
export const START_OBJECT_SPREAD = 'START_OBJECT_SPREAD';

export const TEST_ARRAY_SPREAD = 'TEST_ARRAY_SPREAD';
export const TEST_ARRAY_CONCAT = 'TEST_ARRAY_CONCAT';
export const TEST_ARRAY_PUSH = 'TEST_ARRAY_PUSH';
export const TEST_OBJECT_SPREAD = 'TEST_OBJECT_SPREAD';

export const TIMER = 'TIMER';
export const RESET = 'RESET';

const actions = {
  startArraySpread: () => createAction(START_ARRAY_SPREAD),
  startArrayConcat: () => createAction(START_ARRAY_CONCAT),
  startArrayPush: () => createAction(START_ARRAY_PUSH),
  startObjectSpread: () => createAction(START_OBJECT_SPREAD),
  testArraySpread: (answer: Answer) => createAction(TEST_ARRAY_SPREAD, { answer }),
  testArrayConcat: (answer: Answer) => createAction(TEST_ARRAY_CONCAT, { answer }),
  testArrayPush: (answer: Answer) => createAction(TEST_ARRAY_PUSH, { answer }),
  testObjectSpread: (answer: Answer) => createAction(TEST_OBJECT_SPREAD, { answer }),

  timer: (message: string) => {
    console.log(".");
    return createAction(TIMER, { start: performance.now(), message })
  },
  reset: () => createAction(RESET),

  sequence: () => createAction(SEQUENCE),
};
export type MessagesAction = ActionsUnion<typeof actions>;

export { actions as messagesActions };
//export { Action as MessagesAction };

export type Answer = {
  cid: string,
  data: string
}

export type MessagesState = {
  list: Array<string>;
  instructions: string;
  visible: boolean;
  spread: Array<Answer>;
  concat: Array<Answer>;
  push: Array<Answer>;
  object: {
    [s: string]: Answer
  }
};

const initialState: MessagesState = {
  list: [],
  instructions: '',
  visible: false,
  spread: [],
  concat: [],
  push: [],
  object: {}
};

export const messagesReducer = (state: MessagesState = initialState, action: MessagesAction): MessagesState => {
  switch (action.type) {
    case TEST_ARRAY_SPREAD:
      return {
        ...state,
        spread: [...state.spread, action.payload.answer]
      }
    case TEST_ARRAY_CONCAT:
      return {
        ...state,
        concat: [action.payload.answer].concat(state.concat)
      }
    case TEST_ARRAY_PUSH:
      state.push.push(action.payload.answer)
      return state;
    case TEST_OBJECT_SPREAD:
      return {
        ...state,
        object: {
          ...state.object,
          [action.payload.answer.cid]: action.payload.answer
        }
      }
    case RESET:
      return {
        ...initialState,
        push: []
      }
    default:
      return state;
  }
};

export default messagesReducer;
