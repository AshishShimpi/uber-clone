import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { GeoCoding } from 'src/app/models/geo-coding-api.model';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class GeoLocationService {

    geoCodingAPI: string = 'https://api.maptiler.com/geocoding/';

    constructor(private http: HttpClient,
        public dialog: MatDialog,
    ) { }

    public handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            
            console.error('An error occurred:', error);
            
        } else {
            
            console.error(
                `Backend returned code ${error.status}, body was: `, error.error);
        }
        return throwError(
            () => new Error('Something bad happened; please try again later.')
        );
    }

    forwardGeoCoding(place: string, field: string): Observable<GeoCoding> {
        return this.http.get<GeoCoding>(this.geoCodingAPI + place +
            '.json?' +
            'key=' + environment.MAPTILER_API_KEY)
    }

    reverseGeoCoding(longitude: number, latitude: number): Observable<GeoCoding> {
        return this.http.get<GeoCoding>(this.geoCodingAPI + longitude + ',' + latitude +
            '.json?bbox=7.9655,68.1767,35.4941,89.4026' +
            '&key=' + environment.MAPTILER_API_KEY).pipe(
                catchError(this.handleError)
            );
    }

}
