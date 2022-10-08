import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import maplibregl from "maplibre-gl";
import MapLibreGlDirections, { LoadingIndicatorControl, layersFactory } from "@maplibre/maplibre-gl-directions";
import { layers } from 'src/assets/restyle';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/services/common.service';
import { GeoCoding } from '../models/geo-coding-api.model';

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

    constructor(private common: CommonService) { }

    ngOnInit(): void {
        // this.initializeMap();
        // this.listenForRouteData();
        this.mapLoaded.emit({loaded:true});
    }

    initializeMap() {
        var mapBoundry = new maplibregl.LngLatBounds([ 57.34227190521144, 7.017091088985045], [97.4025614766 , 35.4940095078]);
        
        this.map = new maplibregl.Map({
            container: 'map',
            style: 'https://api.maptiler.com/maps/bright/style.json?key=' + environment.MAPTILER_API_KEY,
            center: [72.8777, 19.0760], // starting position [lng, lat]
            zoom: 10, // starting zoom,
            maxBounds: mapBoundry,
        });


        let nav = new maplibregl.NavigationControl({});
        this.map.addControl(nav, 'top-right');

        this.map.loadImage("../../assets/marker-icon.png", (error, image) => {
            if (!error) this.map.addImage("balloon-waypoint", image);
        });

        // this.map.loadImage("../../assets/direction-arrow.png", (error, image) => {
        //     if (!error && image) {
        //         this.map.addImage("direction-arrow", image);
        //     }
        // });

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

        this.map.addControl(new LoadingIndicatorControl(this.directions,{
            fill: "#000000",
            size: "30px"
        }));

        this.directions.on("fetchroutesend", (e) => {
            console.log('fetch finished', e);
        });

        // directions.interactive = true;
    }

    listenForRouteData() {

        this.common.tripData.subscribe({
            next: (res) => {
                this.showRoute(res.src, res.dest);
                
                this.routeSearchComplete.emit();
                console.log('Route is done');
            }
        });
    }

    showRoute(src: GeoCoding, dest: GeoCoding) {

        console.log('listened coordinate data is');
        console.log(src.features[0].center, typeof (dest.features[0].center));
        
        this.directions.clear();
        
        this.directions.setWaypoints([
            src.features[0].center,
            dest.features[0].center
        ]);

        this.map.fitBounds(
            [src.features[0].center, dest.features[0].center],
            {
                padding: { top: 150, bottom: 100, left: 500, right: 150 },
                linear: false,
                duration: 1000,
                pitch: 30
            }
        );

    }

    emitMapLoad(){
        this.mapLoaded.emit({loaded:true});
        console.log('Map is loaded');
    }

    ngOnDestroy() {

        console.log('destroying all');

        this.common.tripData.unsubscribe();
    }

}


