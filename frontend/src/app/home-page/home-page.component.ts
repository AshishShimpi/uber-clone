import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/services/common.service';
import { GeoLocationService } from 'src/services/geo-location.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

    constructor(
        private geoCoding: GeoLocationService,
        private common: CommonService,
        public dialog: MatDialog,
    ) { }

    frm: string = "";
    to: string = "";

    buttonState: string = "Find Cab";
    carList: any[] = [{
        thumbnail: "../../assets/UberBlack.jpg",
        name: "UberBlack",
    },
    {
        thumbnail: "../../assets/UberComfort.jpg",
        name: "UberComfort",
    },
    {
        thumbnail: "../../assets/UberGreen.jpg",
        name: "UberGreen",
    },
    {
        thumbnail: "../../assets/UberBlackSUV.jpg",
        name: "UberBlackSUV",
    },
    {
        thumbnail: "../../assets/UberSelect.jpeg",
        name: "UberSelect",
    },
    {
        thumbnail: "../../assets/UberXL.jpg",
        name: "UberXL",
    },
    {
        thumbnail: "../../assets/UberBlack.jpg",
        name: "UberBlack",
    },
    ];

    ngOnInit(): void {
        // this.geoCoding.forwardGeoCoding('pune','to')
        //     .subscribe({
        //         next: (res) => {
        //             console.log('geocoding is', res);
        //         },
        //         error: (err) => {
        //             console.log('test in ngOnInit \n', err);
        //         }
        //     });
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.geoCoding.reverseGeoCoding(
                    position.coords.longitude,
                    position.coords.latitude
                )
                    .subscribe({
                        next: (res) => {
                            console.log('reverse geocoding is', res);
                            this.frm = res.features[0].place_name;
                        },
                        error: (err) => {
                            console.log('Error in reverseGeocoding \n', err);
                            this.dialog.open(DialogComponent, {
                                height: '200px',
                                width: '400px',
                            });

                        }
                    })
            });
        }
    }

    afterMapLoaded(data) {
        this.common.disableUberButton = !data.loaded;
        console.log('Map is tooloaded', this.common.disableUberButton);

    }

    mapCoordinates() {

    }

    afterSearch(data) {
        this.buttonState = data.buttonState;
        this.common.disableUberButton = false;
        console.log('Route is done', this.common.disableUberButton);

    }

    getButtonValue() {
        return this.common.disableUberButton;
    }


    onSubmit(form: NgForm) {
        if (!form.valid) {
            form.form.markAllAsTouched();
        } else {
            console.log('form data is', form);
            this.buttonState = "Finding the Route";
            this.common.disableUberButton = true;
            this.common.syncTripData(this.frm, this.to);
        }
    }
}
