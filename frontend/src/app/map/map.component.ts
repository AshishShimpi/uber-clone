import { Component, OnInit } from '@angular/core';
import maplibregl from "maplibre-gl";
import MapLibreGlDirections, { LoadingIndicatorControl, layersFactory } from "@maplibre/maplibre-gl-directions";
import { layers } from 'src/assets/restyle';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    map: any;
    constructor() { }

    ngOnInit(): void {
        this.initializeMap();
    }

    initializeMap() {
        this.map = new maplibregl.Map({
            container: 'map',
            style: 'https://api.maptiler.com/maps/bright/style.json?key=NsTE7pRDxbgmuDt7bEY8',
            center: [72.99984769174932, 19.12596157299783], // starting position [lng, lat]
            zoom: 12 // starting zoom,
        });

        let nav = new maplibregl.NavigationControl({});
        this.map.addControl(nav, 'top-right');
        const lay = layersFactory();
        console.log(lay);

        this.map.loadImage("../../assets/marker-icon.png", (error, image) => {
            if (!error) this.map.addImage("balloon-waypoint", image);
        });

        this.map.loadImage("../../assets/direction-arrow.png", (error, image) => {
            if (!error && image) {
                this.map.addImage("direction-arrow", image);
            }
        });

        

        this.map.on("load", () => {

            const directions = new MapLibreGlDirections(this.map, {
                profile: "driving",
                requestOptions: {
                    alternatives: "true",
                    annotations: "distance,duration"
                },
                layers,
                sensitiveWaypointLayers: ["maplibre-gl-directions-waypoint", "maplibre-gl-directions-waypoint-casing"],
                sensitiveSnappointLayers: ["maplibre-gl-directions-snappline"],
                sensitiveRoutelineLayers: ["maplibre-gl-directions-routeline"],
                sensitiveAltRoutelineLayers: ["maplibre-gl-directions-alt-routeline"],
            });
            this.map.addControl(new LoadingIndicatorControl(directions));
            // directions.interactive = true;
            directions.setWaypoints([
                [73.2753736386154, 19.11822160710978],
                [72.99984769174932, 19.12596157299783]
            ]);
            this.map.fitBounds([[73.2753736386154, 19.11822160710978],
                [72.99984769174932, 19.12596157299783]], {
                    padding: { top: 150, bottom: 100, left: 100, right: 100 },
                    linear : false,
                    duration: 1000,
                    pitch : 30
                });
        });

    }

}


