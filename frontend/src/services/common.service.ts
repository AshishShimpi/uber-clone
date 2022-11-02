import { Injectable, Output, EventEmitter } from '@angular/core';
import { GeoLocationService } from './geo-location.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogComponent } from '../app/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    @Output() tripData = new EventEmitter<object>();

    value$;


    constructor(private geoCoding: GeoLocationService,
        public dialog: MatDialog
    ) { }

    syncTripData(source: string, destination: string) {

        this.value$ = forkJoin([
            this.geoCoding.forwardGeoCoding(source, 'from'),
            this.geoCoding.forwardGeoCoding(destination, 'to')
        ]).pipe(
            map(([src, dest]) => {
                return { src, dest };
            })
        );

        this.value$.subscribe({
            next: (res) => {

                this.tripData.emit({ plottingData: res });
            },
            error: (err) => {

                this.dialog.open(DialogComponent, {
                    // height: '200px',
                    width: '400px',

                });

            }
        });

    }

    clearMap() {
        this.tripData.emit({ plottingData: false });
    }

    ngOnDestroy() {
        this.value$.unsubscribe();
    }
}
