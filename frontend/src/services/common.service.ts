import { Injectable, Output, EventEmitter } from '@angular/core';
import { GeoLocationService } from 'src/services/geo-location.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    @Output() tripData = new EventEmitter<object>();
    @Output() tripStats = new EventEmitter<object>();
    value$;
    disableUberButton: boolean = false;

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
                console.log('emitting value from common', res);
                this.tripData.emit(res);
            },
            error:(err) => {
                console.log('Error in common subscribe \n',err);
                this.dialog.open(DialogComponent, {
                    height: '200px',
                    width: '400px',
                    data: err,
                });
                this.disableUberButton = false;
            }
        });

    }


    syncTripStats(distance: number, duration: number) {
        this.tripStats.emit(
            {
                distance: distance,
                duration: duration
            }
        )
    }

    ngOnDestroy() {
        this.value$.unsubscribe();
    }
}
