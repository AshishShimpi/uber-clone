import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import maplibregl from "maplibre-gl";
import MapLibreGlDirections, { LoadingIndicatorControl, layersFactory } from "@maplibre/maplibre-gl-directions";
import { layers } from 'src/assets/restyle';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/services/common.service';
import { GeoCoding } from '../models/geo-coding-api.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/dialog/dialog.component';
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    private map: any;
    private directions: any;

    @Output() mapLoaded = new EventEmitter();
    @Output() routeSearchComplete = new EventEmitter();

    constructor(private common: CommonService,
        private dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.initializeMap();
        this.listenForRouteData();
    }

    initializeMap() {
        var mapBoundry = new maplibregl.LngLatBounds([57.34227190521144, 7.017091088985045], [97.4025614766, 35.4940095078]);

        this.map = new maplibregl.Map({
            container: 'map',
            style: 'https://api.maptiler.com/maps/'+ environment.MAP_STYLE +'/style.json?key=' + environment.MAPTILER_API_KEY,
            center: [72.8777, 19.0760], // starting position [lng, lat]
            zoom: 10, // starting zoom,
            // maxBounds: mapBoundry,
        });


        let nav = new maplibregl.NavigationControl({});
        this.map.addControl(nav, 'top-right');

        this.map.loadImage("../../assets/marker-icon.png", (error, image) => {
            if (!error) this.map.addImage("balloon-waypoint", image);
        });

        this.map.loadImage("../../assets/direction-arrow.png", (error, image) => {
            if (!error && image) {
                this.map.addImage("direction-arrow", image);
            }
        });

        this.map.on("load", () => {
            this.initializeDirections();
            this.emitMapLoad();
        });

    }

    initializeDirections() {

        this.directions = new MapLibreGlDirections(this.map, {
            profile: "driving",
            requestOptions: {
                alternatives: "true",
            },
            layers,
            sensitiveWaypointLayers: ["maplibre-gl-directions-waypoint", "maplibre-gl-directions-waypoint-casing"],
            sensitiveSnappointLayers: ["maplibre-gl-directions-snappline"],
            sensitiveRoutelineLayers: ["maplibre-gl-directions-routeline"],
            sensitiveAltRoutelineLayers: ["maplibre-gl-directions-alt-routeline"],
        });

        this.map.addControl(new LoadingIndicatorControl(this.directions, {
            fill: "#11ef0d",
            size: "30px"
        }));

        this.directions.on("fetchroutesend", (e) => {

            if (e.data?.code === "NoRoute") {

                this.routeSearchComplete.emit({ buttonState: "Find Cab" });
            }
            else if (e.data?.code === "Ok") {

                this.routeSearchComplete.emit(
                    {
                        buttonState: "Confirm",
                        distance: e.data.routes[0].distance,
                        duration: e.data.routes[0].duration,
                    }
                );
            }
        });
    }

    listenForRouteData() {

        this.common.tripData.subscribe({
            next: (res) => {
                if (res.plottingData) {
                    this.showRoute(res.plottingData.src, res.plottingData.dest);

                }
                else {
                    this.clearMap();
                }
            }
        });
    }

    showRoute(src: GeoCoding, dest: GeoCoding) {




        if (src.features.length === 0 || dest.features.length === 0) {

            this.dialog.open(DialogComponent, {
                // height: '200px',
                width: '400px',
                data: {
                    error: 'Not found',
                    field: src.features.length === 0 ? 'from' : 'to',
                },
            });
            this.routeSearchComplete.emit({ buttonState: "Find Cab" });

            return;
        }

        this.directions.clear();

        this.directions.setWaypoints([
            src.features[0].center,
            dest.features[0].center

        ]).catch(e => {

            this.dialog.open(DialogComponent, {
                // height: '200px',
                width: '400px',
                data: {
                    routeNotPossible: true,
                    routeNotPossibleMessage: 'Routing between provided locations is not possible.'
                },
            });

        });

        this.map.fitBounds(
            [src.features[0].center, dest.features[0].center],
            {
                padding: { top: 150, bottom: 100, left: 500, right: 150 },
                linear: false,
                duration: 1000,
                // pitch: 30
            }
        );

    }

    emitMapLoad() {
        this.mapLoaded.emit({ loaded: true });

    }

    clearMap() {
        this.directions.clear();
    }

    ngOnDestroy() {



        this.common.tripData.unsubscribe();
        this.directions.destroy();
        this.directions = undefined;
    }

}


