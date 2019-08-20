import { combineEpics, Epic, ActionsObservable, StateObservable } from 'redux-observable';
import {
  AnswerAction,
  answerActions,
  SEQUENCE,
  TIMER,
  START_ARRAY_SPREAD,
  START_ARRAY_CONCAT,
  START_OBJECT_SPREAD,
  START_ARRAY_PUSH,
} from '../features/answers/redux';
import { RootState } from '../reducers'
import { ofType } from '@martin_hotell/rex-tils';
import { concat, of, range } from 'rxjs';
import {
  flatMap,
  map,
  tap,
  ignoreElements,
} from 'rxjs/operators';



const timerEpic: Epic<AnswerAction, AnswerAction, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(TIMER),
    tap((action) => {
      console.log(action.payload.message, performance.now() - action.payload.start)
    }),
    ignoreElements()
  )

const testData = "asdfasdfasdfasdfasfd";
const max = 2000;

const arraySpreadEpic: Epic<AnswerAction, AnswerAction, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(START_ARRAY_SPREAD),
    flatMap(() => {
      const timer = answerActions.timer('Array spread: ');
      return concat(
        of(answerActions.reset()),
        range(0, max).pipe(
          map((ix) => answerActions.testArraySpread({ cid: `${ix}`, data: testData + ix }))
        ),
        of(timer)
      )
    })
  )

const arrayConcatEpic: Epic<AnswerAction, AnswerAction, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(START_ARRAY_CONCAT),
    flatMap(() => {
      const timer = answerActions.timer('Array concat: ');
      return concat(
        of(answerActions.reset()),
        range(0, max).pipe(
          map((ix) => answerActions.testArrayConcat({ cid: `${ix}`, data: testData + ix }))
        ),
        of(timer)
      )
    })
  )

const arrayPushEpic: Epic<AnswerAction, AnswerAction, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(START_ARRAY_PUSH),
    flatMap(() => {
      const timer = answerActions.timer('Array push: ');
      return concat(
        of(answerActions.reset()),
        range(0, max).pipe(
          map((ix) => answerActions.testArrayPush({ cid: `${ix}`, data: testData + ix }))
        ),
        of(timer)
      )
    })
  )

const objectSpreadEpic: Epic<AnswerAction, AnswerAction, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(START_OBJECT_SPREAD),
    flatMap(() => {
      const timer = answerActions.timer('Object spread: ');
      return concat(
        of(answerActions.reset()),
        range(0, max).pipe(
          map((ix) => answerActions.testObjectSpread({ cid: `${ix}`, data: testData + ix }))
        ),
        of(timer)
      )
    })
  )

const testEpic: Epic<AnswerAction, AnswerAction, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(SEQUENCE),
    ignoreElements()
  )

// export const rootEpic = combineEpics(testEpic, testEpic, testEpic, timerEpic, arraySpreadEpic, arrayConcatEpic, arrayPushEpic, objectSpreadEpic);
export const rootEpic = combineEpics(timerEpic, arraySpreadEpic, arrayConcatEpic, arrayPushEpic, objectSpreadEpic);
