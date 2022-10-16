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
    baseprice: number;
    duration: string;
    buttonState: string = "Find Cab";
    disableUberButton: boolean = false;
    selectedCar:string;

    renderedCarList;
    carList = [
        {
            thumbnail: "../../assets/UberComfort.jpg",
            name: "UberComfort",
            priceMultiplier: 1,
        },
        {
            thumbnail: "../../assets/UberBlack.jpg",
            name: "UberBlack",
            priceMultiplier: 1.2,
        },
        {
            thumbnail: "../../assets/UberGreen.jpg",
            name: "UberGreen",
            priceMultiplier: 1.5,
        },
        {
            thumbnail: "../../assets/UberXL.jpg",
            name: "UberXL",
            priceMultiplier: 1.6,
        },
        {
            thumbnail: "../../assets/UberBlackSUV.jpg",
            name: "UberBlackSUV",
            priceMultiplier: 1.7,
        },
        {
            thumbnail: "../../assets/UberSelect.jpeg",
            name: "UberSelect",
            priceMultiplier: 1.8,
        },

    ];

    ngOnInit(): void {
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

                            this.frm = res.features[0].place_name;
                        },
                        error: (err) => {

                            this.dialog.open(DialogComponent, {
                                // height: '200px',
                                width: '400px',
                            });

                        }
                    })
            });
            this.resetRide();
        }
    }

    afterMapLoaded(data) {

        this.disableUberButton = !data.loaded;

    }

    afterRouteSearch(data) {

        setTimeout(() => {
            this.buttonState = data.buttonState;
        }, 100);

        if (data.buttonState === "Confirm") {

            this.baseprice = data.duration;
            this.renderedCarList = this.carList;
            this.calculateTime(data.duration);


        } else {
            this.disableUberButton = false;
        }
    }

    calculateTime(duration: number) {

        if (duration / 60 >= 60) {
            let hours = duration / 60 / 60;
            this.duration = Math.floor(hours).toFixed() + ' Hour';


            if (hours % 60 !== 0) {
                this.duration += ' ' + (duration / 60 % 60).toFixed() + ' Min Trip';
            }


        } else {

            this.duration = (duration / 60).toFixed() + ' Min Trip';
        }
    }

    setCab(index: number) {
        this.selectedCar = this.carList[index].name;
        this.buttonState = 'Confirm ' + this.selectedCar;

        this.disableUberButton = false;
    }

    onSubmit(form: NgForm) {

        if (this.buttonState === "Find Cab") {
            if (!form.valid) {
                form.form.markAllAsTouched();
            } else {

                this.disableUberButton = true;
                this.buttonState = "Finding the Route";
                this.common.syncTripData(this.frm, this.to);
            }

        } else {

            this.dialog.open(DialogComponent, {
                // height: '200px',
                width: '400px',
                data: { confirm: `Your ${this.selectedCar} is Confirmed`, heading: 'Enjoy Your Ride' },
            });
            this.selectedCar = undefined;
            form.form.reset();
            this.resetRide();
            this.common.clearMap();
        }
    }

    resetRide() {


        this.renderedCarList = undefined;
        this.buttonState = 'Find Cab';
        this.disableUberButton = false;

    }

    getButtonValue() {

        return this.disableUberButton;
    }

    getPrice(priceMultiplier: number) {
        return ((this.baseprice / 13 ** 5) * priceMultiplier).toFixed(5);
    }
}
