import { Component, OnInit } from '@angular/core';
import maplibregl from "maplibre-gl";

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    map: any;
    count: number = 9;
    constructor() { }

    ngOnInit(): void {
        this.initializeMap();
    }

    initializeMap() {
        this.map = new maplibregl.Map({
            container: 'map',
            style: 'https://api.maptiler.com/maps/bright/style.json?key=NsTE7pRDxbgmuDt7bEY8',
            // stylesheet location
            center: [72.99984769174932, 19.12596157299783], // starting position [lng, lat]
            zoom: 12 // starting zoom,
        });
        let nav = new maplibregl.NavigationControl({});
        this.map.addControl(nav, 'top-right');
        this.map.addControl(new maplibregl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
        }));
    }
    // Control implemented as ES6 class

}


