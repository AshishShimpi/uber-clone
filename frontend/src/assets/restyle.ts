import type { LayerSpecification } from "maplibre-gl";

// The following layers are used in the "Restyling" example.
export const layers = [
    {
        id: "maplibre-gl-directions-snapline",
        type: "line",
        source: "maplibre-gl-directions",
        layout: {
            "line-cap": "round",
            "line-join": "round",
        },
        paint: {
            "line-dasharray": [2, 2],
            "line-color": "#3eb655",
            "line-width": 6,
        },
        filter: ["==", ["get", "type"], "SNAPLINE"],
    },

    {
        id: "maplibre-gl-directions-alt-routeline",
        type: "line",
        source: "maplibre-gl-directions",
        layout: {
            "line-cap": "butt",
            "line-join": "round",
        },
        paint: {
            "line-color": "#404040",
            "line-width": 6,
            "line-opacity": 0.5,
        },
        filter: ["==", ["get", "route"], "ALT"],
    },

    {
        id: "maplibre-gl-directions-routeline",
        type: "line",
        source: "maplibre-gl-directions",
        layout: {
            "line-cap": "butt",
            "line-join": "round",
        },
        paint: {
            "line-color": "#000000",
            "line-width": 6,
        },
        filter: ["==", ["get", "route"], "SELECTED"],
    },

    {
        id: "maplibre-gl-directions-routeline-direction-arrow",
        type: "symbol",
        source: "maplibre-gl-directions",
        layout: {
            "symbol-placement": "line-center",
            "icon-image": "direction-arrow",
            "icon-size": 0.02,
        },
        paint: {
            "icon-opacity": 0.8,
        },
        filter: ["==", ["get", "route"], "SELECTED"],
    },

    {
        id: "maplibre-gl-directions-hoverpoint",
        type: "symbol",
        source: "maplibre-gl-directions",
        layout: {
            "visibility": "none"
        },
        filter: ["==", ["get", "type"], "HOVERPOINT"],
    },

    {
        id: "maplibre-gl-directions-snappoint",
        type: "symbol",
        source: "maplibre-gl-directions",
        layout: {
            "visibility": "none"
        },
        filter: ["==", ["get", "type"], "SNAPPOINT"],
    },
    // {
    //     id: "maplibre-gl-directions-waypoint-casing",
    //     type: "circle",
    //     source: "maplibre-gl-directions",
    //     paint: {
    //         "circle-radius": [
    //             "interpolate",["exponential",1.5],["zoom"],0,
    //             ["case",["boolean",["get","highlight"],false],14,12],5,
    //             ["case",["boolean",["get","highlight"],false],14,12],18,
    //             ["case",["boolean",["get","highlight"],false],33,28]],
    //         "circle-color": [
    //             "case", ["boolean", ["get", "highlight"], false], "#000000", "#9ca3af"
    //         ]
    //     },
    //     filter: ["==", ["get", "type"], "WAYPOINT"],
    // },

    {
        id: "maplibre-gl-directions-waypoint",
        type: "circle",
        source: "maplibre-gl-directions",
        paint: {
            "circle-radius": 8,
            "circle-color": [
                "case", ["boolean", ["get", "highlight"], false], "#000000", "#9ca3af"
            ]
        },
        filter: ["==", ["get", "type"], "WAYPOINT"],
    },

    {
        id: "maplibre-gl-directions-waypoint-icon",
        type: "symbol",
        source: "maplibre-gl-directions",
        layout: {
            "icon-image": "balloon-waypoint",
            "icon-size": 0.8,
            "icon-anchor": "bottom",
            "icon-ignore-placement": true,
            "icon-overlap": "always",
        },
        filter: ["==", ["get", "type"], "WAYPOINT"],
    },
] as LayerSpecification[];
