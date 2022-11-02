import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../services/web3.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

    constructor(
        private Web3: Web3Service,
        private router: Router,
    ) { }

    sessionStorage: Storage;

    ngOnInit(): void {
        this.sessionStorage = window.sessionStorage;
        console.log(this.sessionStorage);
        
        //checks for inApp navigation
        if (this.Web3.currentAccount) this.sessionStorage.setItem('userLoggedIn', 'true');
        
        if (this.sessionStorage.getItem('userLoggedIn') && this.sessionStorage.getItem('userLoggedIn') === 'true') {
            console.log(this.sessionStorage.getItem('userLoggedIn'));
            this.router.navigate(['/bookCab']);
        }
    }

    connect() {
        this.Web3.connectWithMetamask();
    }
}
