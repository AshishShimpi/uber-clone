import { Component, OnInit } from '@angular/core';
import { GeoLocationService } from 'src/services/geo-location.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

    constructor(private geoCoding: GeoLocationService) { }

    frm: string = "";
    to: string = "";
    position: any;
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
        // this.geoCoding.forwardGeoCoding('mumbai').subscribe({
        //     next: (res) => {
        //         console.log(
        //             'geocoding is', res
        //         )
        //     }
        // });
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
                        }
                    })
            });
        }
    }

}
