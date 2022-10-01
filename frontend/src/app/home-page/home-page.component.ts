import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

    constructor() { }

    carList:any[]=[{
        thumbnail:"../../assets/UberBlack.jpg",
        name : "UberBlack",
    },
    {
        thumbnail:"../../assets/UberBlackSUV.jpg",
        name : "UberBlackSUV",
    },
    {
        thumbnail:"../../assets/UberComfort.jpg",
        name : "UberComfort",
    },
    {
        thumbnail:"../../assets/UberGreen.jpg",
        name : "UberGreen",
    },
    {
        thumbnail:"../../assets/UberSelect.jpeg",
        name : "UberSelect",
    },
    {
        thumbnail:"../../assets/UberXL.jpg",
        name : "UberXL",
    },
    {
        thumbnail:"../../assets/UberBlack.jpg",
        name : "UberBlack",
    },
    ];

    ngOnInit(): void {
    }

}
