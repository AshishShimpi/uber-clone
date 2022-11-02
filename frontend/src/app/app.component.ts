import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../services/web3.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Uber-Clone';

    constructor(private Web3: Web3Service) {}

    ngOnInit(): void {
        this.Web3.checkMetamask().subscribe({
            next: ()=>{
            },
            error:(err)=>{
                console.log('caught in main',err);
            }
        });     
    }
}
