import { Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import detectEthereumProvider from '@metamask/detect-provider';
import { from, switchMap } from 'rxjs';
import { DialogComponent } from '../../src/app/dialog/dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

interface ConnectInfo {
    chainId: string;
}
interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}

@Injectable({
    providedIn: 'root'
})

export class Web3Service {

    constructor(
        private zone: NgZone,
        private router: Router,
        public dialog: MatDialog,
    ) { }
    
    ethereum: any = null;
    currentAccount: string;
    userLoggedIn: boolean = false;
    sessionStorage = window.sessionStorage;
    isProviderLoaded = false;
    isNotRestricted: boolean = false;

    checkMetamask() {

        return from(detectEthereumProvider()).pipe(

            // Step 1: Request (limited) access to users ethereum account
            switchMap(async (provider) => {

                this.ethereum = provider;
                if(!provider){
                    this.isNotRestricted = true;
                    this.zone.run(() => this.router.navigate(['/auth']));
                }
                else if (provider && provider.isMetaMask) {
                    this.activateListners();

                    from(this.ethereum.request({ method: 'eth_accounts' })).subscribe({
                        next: (res: string[]) => {
                            if (res.length >= 1) {

                                this.currentAccount = res[0];
                                
                                this.sessionStorage.setItem('userLoggedIn', 'true');
                                this.zone.run(() => this.router.navigate(['/bookCab']));

                            } else {
                                
                                this.sessionStorage.setItem('userLoggedIn', 'false');
                                this.zone.run(() => this.router.navigate(['/auth']));
                            }
                            this.isProviderLoaded = true;
                        },
                        error: (err: ProviderRpcError) => this.accountsError(err)
                    })
                }
            })
        );
    }

    handleAccountsChange(accounts) {

        if (accounts.length === 0) {
            // MetaMask is locked or the user has not connected any accounts
            
            this.currentAccount = null;
            this.sessionStorage.setItem('userLoggedIn', 'false');
            // if (this.router.url !== '/auth') {
            this.zone.run(() => this.router.navigate(['/auth']));
            // }

        } else if (accounts[0] !== this.currentAccount) {
            
            this.currentAccount = accounts[0];
        }
    }

    getAccounts() {
        return from(this.ethereum.request({ method: 'eth_requestAccounts' }));
    }

    activateListners() {

        this.ethereum.on('connect', (connectInfo: ConnectInfo) => {
            console.log('Connected to Ethereum ', connectInfo);
        });

        this.ethereum.on('disconnect', (error: ProviderRpcError) => {
            console.log('Disconnected from Ethereum ', error);
        });

        this.ethereum.on('accountsChanged', (accounts: string[]) => {
            // Handle the new accounts, or lack thereof.
            // "accounts" will always be an array, but it can be empty.
            this.dialog.closeAll();
            console.log('Accounts Changed');
            this.handleAccountsChange(accounts);
        });

        this.ethereum.on('chainChanged', (chainId: string) => {
            // Handle the new chain.
            // Correctly handling chain changes can be complicated.
            // We recommend reloading the page unless you have good reason not to.
            console.log('Chain Changed', chainId);
            window.location.reload();
        });
    }

    connectWithMetamask() {

        if (!this.ethereum) {
            this.callDialog(`Please install MetaMask`);
            return;
        }

        if (!this.ethereum.isMetaMask) {
            this.callDialog(`Do you have multiple wallets installed?`);
            return;
        }


        this.getAccounts().subscribe({
            next: (res: string[]) => {
                this.handleAccountsChange(res);
                this.sessionStorage.setItem('userLoggedIn', 'true');
                this.zone.run(() => this.router.navigate(['/bookCab']));
            },
            error: (err: ProviderRpcError) => this.accountsError(err)
        });
    }

    accountsError(err: ProviderRpcError) {
        
        if (err.code === 4001) {
            this.callDialog(`The request was rejected by the user`);
        }
    }

    callDialog(custom: string) {
        this.dialog.open(DialogComponent, {
            width: '400px',
            data: { custom: custom },
        });
    }

    sendTransaction(amount:number) {
        let value = BigInt((amount * 1e18).toFixed());
        
        const transactionParameters = {
            nonce: '0x00', // ignored by MetaMask
            to: environment.DESTINATION_ACCOUNT, // Required except during contract publications.
            from: this.currentAccount, // must match user's active address.
            value: '0x' + value.toString(16), // Only required to send ether to the recipient from the initiating external account.
        };

        return from(this.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        }));
    }

}