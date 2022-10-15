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
    selectedCar;

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
            this.resetRide();
        }
    }

    afterMapLoaded(data) {

        this.disableUberButton = !data.loaded;
        console.log('Map is tooloaded', this.disableUberButton);
    }

    afterRouteSearch(data) {

        setTimeout(() => {
            this.buttonState = data.buttonState;
        }, 100);

        if (data.buttonState === "Confirm") {

            this.baseprice = data.duration;
            this.renderedCarList = this.carList;
            this.calculateTime(data.duration);

            console.log('Route is done', this.disableUberButton);
        }else{
            this.disableUberButton = false;
        }
    }

    calculateTime(duration: number) {

        if (duration / 60 >= 60) {
            let hours = duration / 60 / 60;
            this.duration = Math.floor(hours).toFixed() + ' Hour';
            console.log('duration', this.duration);

            if (hours % 60 !== 0) {
                this.duration += ' ' + (duration / 60 % 60).toFixed() + ' Min Trip';
            }
            console.log('\n is', this.duration);
    
        }else{
            console.log('duration', this.duration);
            this.duration =  (duration / 60).toFixed() + ' Min Trip';
        }
    }

    setCab(index: number) {

        this.buttonState = 'Confirm ' + this.carList[index].name;

        this.disableUberButton = false;
    }

    onSubmit(form: NgForm) {

        if (this.buttonState === "Find Cab") {
            if (!form.valid) {
                form.form.markAllAsTouched();
            } else {
                console.log('form data is', form);
                this.disableUberButton = true;
                this.buttonState = "Finding the Route";
                this.common.syncTripData(this.frm, this.to);
            }

        } else {

            this.dialog.open(DialogComponent, {
                height: '200px',
                width: '400px',
                data: { confirm: 'Your ride is Confirmed', heading: 'Enjoy Your Ride' },
            });
            form.form.reset();
            this.resetRide();
            this.common.clearMap();
        }
    }

    resetRide(){
        console.log('ride reset');
        
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
