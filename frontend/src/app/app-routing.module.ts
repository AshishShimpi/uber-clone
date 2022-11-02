import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
    { path: 'bookCab', component: HomePageComponent },
    { path: 'auth', component: AuthenticationComponent },
    { path: '',   redirectTo: '/auth', pathMatch: 'full' },
    { path: '**', component: AuthenticationComponent }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
