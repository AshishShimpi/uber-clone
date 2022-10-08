import { Injectable, Output, EventEmitter } from '@angular/core';
import { GeoLocationService } from 'src/services/geo-location.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    @Output() tripData = new EventEmitter<object>();
    @Output() tripStats = new EventEmitter<object>();
    value$;

    constructor(private geoCoding: GeoLocationService) { }

    syncTripData(source: string, destination: string) {
        this.value$ = forkJoin([
            this.geoCoding.forwardGeoCoding(source),
            this.geoCoding.forwardGeoCoding(destination)
        ]).pipe(
            map(([src, dest]) => {
                return { src , dest };
            })
        );
        this.value$.subscribe((res)=>{
            console.log('emitting value', res);
            this.tripData.emit(res);
        }) 
    }


    syncTripStats(distance: number, duration: number) {
        this.tripStats.emit(
            {
                distance: distance,
                duration: duration
            }
        )
    }

    ngOnDestroy(){
        this.value$.unsubscribe();
    }
}
