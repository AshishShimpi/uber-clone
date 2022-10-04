import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

    constructor() { }

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
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
                this.frm = position.coords.longitude.toString();
                this.to = position.coords.latitude.toString();
            });
        }
    }

}
