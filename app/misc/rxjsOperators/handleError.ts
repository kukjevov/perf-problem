import {GlobalNotificationsService} from "@anglr/notifications";
import {HttpErrorResponse} from "@angular/common/http";
import {Observable, MonoTypeOperatorFunction, empty} from "rxjs";
import {catchError} from "rxjs/operators";
import * as global from 'config/global';

/**
 * Handles errors and displays them
 * @param notifications Notifications service
 */
export function handleError<T>(notifications: GlobalNotificationsService): MonoTypeOperatorFunction<T>
{
    return (source: Observable<T>) =>
    {
        return source.pipe(catchError((error: HttpErrorResponse) =>
        {
            if(error.error && error.error.message)
            {
                notifications.error(error.error.message);
            }
            else
            {
                if(global.debug)
                {
                    notifications.error(`Neočakávaná chyba, status: ${error.status}, ${JSON.stringify(error.error)}, original: ${error}`);
                }
                else
                {
                    notifications.error("Neočakávaná chyba");
                }
            }

            return empty();
        }));
    };
}