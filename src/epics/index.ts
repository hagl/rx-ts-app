import {
  combineEpics,
  Epic,
  ActionsObservable,
  StateObservable
} from "redux-observable";
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
  ASYNC
} from "../features/messages/actions";
import { RootState } from "../typedefs/types";
import { ofType } from "@martin_hotell/rex-tils";
import {
  concat,
  interval,
  of,
  NEVER,
  race,
  forkJoin,
  EMPTY,
  zip,
  Observable,
  throwError
} from "rxjs";
import {
  flatMap,
  map,
  withLatestFrom,
  takeUntil,
  delay,
  catchError,
  tap,
  timeout,
  take
} from "rxjs/operators";

const pingEpic: Epic = (
  action$: ActionsObservable<MessagesAction>,
  state$: StateObservable<RootState>
) => {
  return action$.pipe(
    ofType(START1),
    flatMap(() =>
      concat(
        of(messagesActions.show()),
        interval(1000).pipe(
          map((value, index) => ({ type: "PING", payload: value })),
          takeUntil(action$.pipe(ofType(STOP1)))
        ),
        of(messagesActions.hide())
      )
    )
  );
};

const pingEpic1: Epic = (
  action$: ActionsObservable<MessagesAction>,
  state$: StateObservable<RootState>
) => {
  return action$.pipe(
    ofType(START1),
    flatMap(
      () =>
        concat(
          of(messagesActions.show()),
          NEVER.pipe(
            takeUntil(
              race(interval(3000), action$.pipe(ofType(STOP1, STOPALL)))
            )
          ),
          of(messagesActions.hide())
        ) //.pipe(takeUntil(action$.pipe(ofType(SHOW))))
    )
  );
};

const pingEpic2: Epic = (
  action$: ActionsObservable<MessagesAction>,
  state$: StateObservable<RootState>
) => {
  return action$.pipe(
    ofType(START2),
    flatMap(
      () =>
        concat(
          of(messagesActions.show()),
          NEVER.pipe(takeUntil(action$.pipe(ofType(STOP2, STOPALL)))),
          of(messagesActions.hide())
        ) //.pipe(takeUntil(action$.pipe(ofType(SHOW))))
    )
  );
};

const showMessageAtLeast3SecEpic: Epic = (
  action$: ActionsObservable<MessagesAction>,
  state$: StateObservable<RootState>
) => {
  return action$.pipe(
    ofType(START2),
    flatMap(
      () =>
        concat(
          of(messagesActions.show()),
          NEVER.pipe(
            takeUntil(zip(action$.pipe(ofType(STOP2, STOPALL)), interval(3000)))
          ),
          of(messagesActions.hide())
        ) //.pipe(takeUntil(action$.pipe(ofType(SHOW))))
    )
  );
};

const getType = (action: MessagesAction): Observable<string> =>
  of(action.type).pipe(delay(500));

const asyncErrorObservable = (
  trigger: string,
  handleTimeout: boolean,
  action: MessagesAction
): Observable<MessagesAction> => {
  console.log(`asyncErrorObservable ${action}`);
  return of("").pipe(
    delay(1000),
    delay(
      action.type == ERROR && action.payload == "timeout" && handleTimeout
        ? 5000
        : 0
    ),
    flatMap(() =>
      action.type == ERROR && action.payload == trigger
        ? throwError(trigger)
        : of(messagesActions.success())
    )
  );
};

const waitForAsyncActionObservable = (
  action$: ActionsObservable<MessagesAction>
): Observable<MessagesAction> => {
  console.log(`waitForAsyncActionObservable`);
  return action$.pipe(
    ofType(ASYNC),
    take(1),
    timeout(1000)
  );
};

const sequenceWithErrorsEpic: Epic = (
  action$: ActionsObservable<MessagesAction>,
  state$: StateObservable<RootState>
) => {
  return action$.pipe(
    ofType(SEQUENCE, ERROR),
    flatMap(action =>
      concat(
        of(messagesActions.show()),
        // variant 1
        /*
         */
        waitForAsyncActionObservable(action$),
        asyncErrorObservable("ERROR1", false, action),
        of(messagesActions.step1()),
        asyncErrorObservable("ERROR2", true, action),
        of(messagesActions.step2()),
        // variant 2
        /*
        asyncErrorObservable(ERROR1, action.type),
        of(messagesActions.step1()),
        getType(action).pipe(flatMap(t => asyncErrorObservable(ERROR2, t))),
        of(messagesActions.step2()),
        */
        // variant 3
        /*
        asyncErrorObservable("ERROR1", false, action).pipe(
          flatMap(a =>
            concat(
              of(messagesActions.step1()),
              getType(a).pipe(flatMap(t => asyncErrorObservable("ERROR2", t)))
            )
          )
        ),
        of(messagesActions.step2()),
        */
        // of(messagesActions.step1()),
        // asyncErrorObservable(ERROR2, action.type),
        // getType(action).pipe(flatMap(t => asyncErrorObservable(ERROR2, t))),
        // of(messagesActions.step2()),
        NEVER.pipe(
          takeUntil(race(action$.pipe(ofType(STOP2, STOPALL)), interval(1000)))
        ),
        of(messagesActions.hide()),
        of(messagesActions.success())
      ).pipe(
        timeout(2000),
        catchError(error => {
          console.log(error);
          return of(messagesActions.hide(), messagesActions.failed());
        })
      )
    )
  );
};

// export const rootEpic = combineEpics(pingEpic1, pingEpic2);
export const rootEpic = combineEpics(
  pingEpic1,
  showMessageAtLeast3SecEpic,
  sequenceWithErrorsEpic
);
