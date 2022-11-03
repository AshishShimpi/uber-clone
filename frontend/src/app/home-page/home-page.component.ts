import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';
import { GeoLocationService } from '../../services/geo-location.service';
import { Web3Service } from '../../services/web3.service';
import { DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';

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
        private router: Router,
        public Web3: Web3Service,
    ) { }

    loader = true;
    frm: string = "";
    to: string = "";
    baseprice: number;
    amount: number = 0;
    duration: string;
    buttonState: string = "Find Cab";
    disableUberButton: boolean = false;
    selectedCar: string;
    sessionStorage: Storage;

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

        this.sessionStorage = window.sessionStorage;

        if(this.Web3.isNotRestricted && !this.Web3.isProviderLoaded){
            this.router.navigate(['/auth']);
        }
        //checks for inApp navigation
        if (this.Web3.isProviderLoaded && !this.Web3.currentAccount) 
            this.sessionStorage.setItem('userLoggedIn', 'false');

        if (this.sessionStorage.getItem('userLoggedIn') && this.sessionStorage.getItem('userLoggedIn') === 'false') {
            this.router.navigate(['/auth']);
        }
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
        this.amount = this.getPrice(this.carList[index].priceMultiplier);
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
            this.disableUberButton = true;
            this.Web3.sendTransaction(this.amount).subscribe({
                next: (transactionHash) => {

                    console.log(transactionHash);
                    this.dialog.open(DialogComponent, {
                        width: '400px',
                        data: { custom: `Your ${this.amount} ETH has been paid & ${this.selectedCar} is Confirmed`, heading: 'Enjoy Your Ride' },
                    });

                    this.selectedCar = undefined;
                    this.resetRide();
                    form.form.reset();
                    this.common.clearMap();
                },
                error: (err) => {

                    console.log('Error in Transaction', err);
                    this.dialog.open(DialogComponent, {
                        width: '400px',
                        data: { custom: `Transaction failed for ${this.amount} ETH`, heading: 'Error' },
                    });
                    this.selectedCar = undefined;
                    this.buttonState = 'Confirm';
                    this.disableUberButton = false;
                }
            })
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
        return Number(((this.baseprice / 13 ** 5) * priceMultiplier).toFixed(5));
    }
}
