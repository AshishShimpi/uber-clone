import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GeoLocationService {

    geoCodingAPI: string = 'https://api.maptiler.com/geocoding/';
    
    constructor(private http: HttpClient) {
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            console.error('An error occurred:', error.error);
        } else {
            console.error(
                `Backend returned code ${error.status}, body was: `, error.error);
        }
        return throwError(
            () => new Error('Something bad happened; please try again later.')
        );
    }

    forwardGeoCoding(query: string): Observable<any> {
        return this.http.get<any>(this.geoCodingAPI + query + '.json?   bbox="7.96553477623,68.1766451354,35.4940095078,97.4025614766"' + '&key=' + environment.MAPTILER_API_KEY).pipe(
            catchError(this.handleError)
        );
    }

    reverseGeoCoding(longitude: number, latitude: number): Observable<any> {
        return this.http.get<any>(this.geoCodingAPI + longitude + ',' + latitude + '.json?   bbox="7.96553477623,68.1766451354,35.4940095078,97.4025614766"' + '&key=' + environment.MAPTILER_API_KEY).pipe(
            catchError(this.handleError)
        );
    }

}
