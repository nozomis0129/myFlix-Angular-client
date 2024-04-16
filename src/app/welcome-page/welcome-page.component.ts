import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * @description Component representing the welcome page of the app.
 * @selector 'app-welcome-page'
 * @templateUrl './welcome-page.component.html'
 * @styleUrls ['./welcome-page.component.scss']
 */

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  /**
   * @constructor
   * @param {MatDialog} dialog -Angular Material's MatDialog service for opening dialog.
   */

  constructor(public dialog: MatDialog) { }
  ngOnInit(): void {
  }

  /**
   * @description Opens the user registration dialog.
   */

  public openUserRegistrationDialog(): void {
    localStorage.clear();
    console.log(localStorage.getItem('token'));
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px'
    });
  }

  /**
   * @description Open the login dialog.
   */

  public openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px'
    });
  }
}

