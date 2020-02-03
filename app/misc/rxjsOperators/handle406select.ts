import {Observable, MonoTypeOperatorFunction, of, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

/**
 * Handles 406 for selector select request
 */
export function handle406select(): MonoTypeOperatorFunction<boolean>
{
    return (source: Observable<boolean>) =>
    {
        return source.pipe(catchError(error =>
        {
            if(error.status == 406)
            {
                return of(false);
            }

            return throwError(error);
        }));
    };
}