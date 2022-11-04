import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/services/web3.service';
import { faker } from '@faker-js/faker';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    constructor(public web3: Web3Service,) { }

    userName: string = 'User';
    gender:'female'|'male';

    ngOnInit(): void {
        this.gender = faker.name.sexType();
        this.userName = faker.name.firstName(this.gender);        
    }

}
