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
} from '../features/messages/actions';
import { RootState } from '../typedefs/types';
import { ofType } from '@martin_hotell/rex-tils';
import { concat, interval, of, NEVER, race, zip, Observable, throwError } from 'rxjs';
import { flatMap, map, withLatestFrom, takeUntil, delay, catchError, tap, timeout, take } from 'rxjs/operators';

const pingEpic: Epic = (action$: ActionsObservable<MessagesAction>, state$: StateObservable<RootState>) => {
  return action$.pipe(
    ofType(START1),
    flatMap(() =>
      concat(
        of(messagesActions.show()),
        interval(1000).pipe(
          map((value, index) => ({ type: 'PING', payload: value })),
          takeUntil(action$.pipe(ofType(STOP1)))
        ),
        of(messagesActions.hide())
      )
    )
  );
};

const showMessage3Sec: Epic = (action$: ActionsObservable<MessagesAction>, state$: StateObservable<RootState>) => {
  return action$.pipe(
    ofType(START1),
    flatMap(() =>
      concat(
        of(messagesActions.show(), messagesActions.info('Wait for 3 sec or click STOP1 to hide message')),
        NEVER.pipe(takeUntil(race(interval(3000), action$.pipe(ofType(STOP1, STOPALL))))),
        of(messagesActions.hide(), messagesActions.info(''))
      )
    )
  );
};

const pingEpic2: Epic = (action$: ActionsObservable<MessagesAction>, state$: StateObservable<RootState>) => {
  return action$.pipe(
    ofType(START2),
    flatMap(() =>
      concat(
        of(messagesActions.show()),
        NEVER.pipe(takeUntil(action$.pipe(ofType(STOP2, STOPALL)))),
        of(messagesActions.hide())
      )
    )
  );
};

const showMessageAtLeast3SecEpic: Epic = (
  action$: ActionsObservable<MessagesAction>,
  state$: StateObservable<RootState>
) => {
  return action$.pipe(
    ofType(START2),
    flatMap(() =>
      concat(
        of(messagesActions.show(), messagesActions.info('click STOP2 to hide message')),
        NEVER.pipe(takeUntil(zip(action$.pipe(ofType(STOP2, STOPALL)), interval(3000)))),
        of(messagesActions.hide(), messagesActions.info(''))
      )
    )
  );
};

const getType = (action: MessagesAction): Observable<string> => of(action.type).pipe(delay(500));

const asyncErrorObservable = (
  trigger: string,
  handleTimeout: boolean,
  action: MessagesAction
): Observable<MessagesAction> => {
  console.log(`asyncErrorObservable ${action}`);
  return of('').pipe(
    delay(1000),
    delay(action.type == ERROR && action.payload == 'timeout' && handleTimeout ? 5000 : 0),
    flatMap(() =>
      action.type == ERROR && action.payload == trigger ? throwError(trigger) : of(messagesActions.success())
    )
  );
};

const waitForAsyncActionObservable = (action$: ActionsObservable<MessagesAction>): Observable<MessagesAction> => {
  console.log(`waitForAsyncActionObservable`);
  return action$.pipe(
    ofType(ASYNC),
    take(1)
    // timeout(1000)
  );
};

const sequenceWithErrorsEpic: Epic = (
  action$: ActionsObservable<MessagesAction>,
  state$: StateObservable<RootState>
) => {
  return action$.pipe(
    ofType(SEQUENCE, ERROR),
    flatMap((action) =>
      concat(
        of(messagesActions.show(), messagesActions.info('Click Async to continue')),
        waitForAsyncActionObservable(action$),
        asyncErrorObservable('ERROR1', false, action),
        of(messagesActions.step1(), messagesActions.info('Step 1 performed')),
        asyncErrorObservable('ERROR2', true, action),
        of(messagesActions.step2(), messagesActions.info('Step 2 performed')),
        NEVER.pipe(takeUntil(race(action$.pipe(ofType(STOP2, STOPALL)), interval(1000)))),
        of(messagesActions.hide()),
        of(messagesActions.success())
      ).pipe(
        timeout(3000),
        catchError((error) => {
          console.log(error);
          return of(messagesActions.hide(), messagesActions.failed(), messagesActions.info('Timeout after 3 sec'));
        })
      )
    )
  );
};

export const rootEpic = combineEpics(showMessage3Sec, showMessageAtLeast3SecEpic, sequenceWithErrorsEpic);
