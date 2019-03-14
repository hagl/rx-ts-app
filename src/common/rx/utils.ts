import { delay, take, ignoreElements } from 'rxjs/operators';
import { MonoTypeOperatorFunction, Observable, merge, EMPTY, empty } from 'rxjs';
import { Action } from '@martin_hotell/rex-tils/types/redux/types';
import { ofType } from '@martin_hotell/rex-tils';

export function ensureDuration<T>(duration: number): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => merge(source, empty().pipe(delay(duration)));
}

export function blockUntil(source: Observable<Action>, t1: string): Observable<never> {
  return source.pipe(
    ofType(t1),
    take(1),
    ignoreElements()
  );
}

export function blockUntil2(source: Observable<Action>, t1: string, t2: string): Observable<never> {
  return source.pipe(
    ofType(t1, t2),
    take(1),
    ignoreElements()
  );
}
