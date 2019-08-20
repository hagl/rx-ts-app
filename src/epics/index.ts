import { combineEpics, Epic, ActionsObservable, StateObservable } from 'redux-observable';
import {
  MessagesAction,
  START1,
  START2,
  STOP1,
  STOP2,
  STOPALL,
  messagesActions,
  SHOW,
  SEQUENCE,
  ERROR,
  ASYNC,
  START_ARRAY_SPREAD,
  TIMER,
  START_ARRAY_CONCAT,
  START_OBJECT_SPREAD,
  START_ARRAY_PUSH,
} from '../features/messages/actions';
import { RootState } from '../typedefs/types';
import { ofType } from '@martin_hotell/rex-tils';
import { concat, interval, of, NEVER, race, range } from 'rxjs';
import {
  flatMap,
  map,
  takeUntil,
  tap,
  ignoreElements,
  delayWhen,
  startWith,
} from 'rxjs/operators';

const showMessage3Sec: Epic = (action$: ActionsObservable<MessagesAction>, state$: StateObservable<RootState>) => {
  return action$.pipe(
    ofType(START1),
    flatMap(() =>
      concat(
        NEVER.pipe(takeUntil(race(interval(3000), action$.pipe(ofType(STOP1, STOPALL))))),
      )
    )
  );
};


const timerEpic: Epic<MessagesAction, MessagesAction, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(TIMER),
    tap((action) => {
      console.log(action.payload.message, performance.now() - action.payload.start)
    }),
    ignoreElements()
  )

const testData = "asdfasdfasdfasdfasfd";
const max = 2000;

const arraySpreadEpic: Epic<MessagesAction, MessagesAction, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(START_ARRAY_SPREAD),
    flatMap(() => {
      const timer = messagesActions.timer('Array spread: ');
      return concat(
        of(messagesActions.reset()),
        range(0, max).pipe(
          map((ix) => messagesActions.testArraySpread({ cid: `${ix}`, data: testData + ix }))
        ),
        of(timer)
      )
    })
  )

const arrayConcatEpic: Epic<MessagesAction, MessagesAction, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(START_ARRAY_CONCAT),
    flatMap(() => {
      const timer = messagesActions.timer('Array concat: ');
      return concat(
        of(messagesActions.reset()),
        range(0, max).pipe(
          map((ix) => messagesActions.testArrayConcat({ cid: `${ix}`, data: testData + ix }))
        ),
        of(timer)
      )
    })
  )

const arrayPushEpic: Epic<MessagesAction, MessagesAction, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(START_ARRAY_PUSH),
    flatMap(() => {
      const timer = messagesActions.timer('Array push: ');
      return concat(
        of(messagesActions.reset()),
        range(0, max).pipe(
          map((ix) => messagesActions.testArrayPush({ cid: `${ix}`, data: testData + ix }))
        ),
        of(timer)
      )
    })
  )

const objectSpreadEpic: Epic<MessagesAction, MessagesAction, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(START_OBJECT_SPREAD),
    flatMap(() => {
      const timer = messagesActions.timer('Object spread: ');
      return concat(
        of(messagesActions.reset()),
        range(0, max).pipe(
          map((ix) => messagesActions.testObjectSpread({ cid: `${ix}`, data: testData + ix }))
        ),
        of(timer)
      )
    })
  )

const sequenceEpic: Epic<MessagesAction, MessagesAction, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(SEQUENCE),
    // flatMap(() => range(1, 5).pipe(
    flatMap(() => of(
      messagesActions.startArraySpread(),
      messagesActions.startArrayConcat(),
      messagesActions.startArrayPush(),
      messagesActions.startObjectSpread()
    ).pipe(
      flatMap(a => of(a).pipe(delayWhen(() => action$.pipe(ofType(TIMER))))),
      startWith(messagesActions.timer("GO"))
    )
      // ))
    ))

export const rootEpic = combineEpics(showMessage3Sec, timerEpic, arraySpreadEpic, arrayConcatEpic, arrayPushEpic, objectSpreadEpic, sequenceEpic);
