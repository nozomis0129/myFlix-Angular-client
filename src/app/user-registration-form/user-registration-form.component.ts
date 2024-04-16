// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input, Inject } from '@angular/core';

// Close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls
import { FetchApiDataService } from '../fetch-api-data.service';

// Display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
* @description Component representing the user registration form.
* @selector 'app-user-registration-form'
* @templateUrl './user-registration-form.component.html'
* @styleUrls ['./user-registration-form.component.scss']
*/

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  token: any = localStorage.getItem('token');

  /**
    * @constructor
    * @param {FetchApiDataService} fetchApiData - Service for user registration API calls.
    * @param {MatDialogRef<UserRegistrationFormComponent>} dialogRef - Reference to the dialog for closing.
    * @param {MatSnackBar} snackBar - Angular Material's MatSnackBar service for notifications.
    */

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, button: string, function: string },
  ) { }

  ngOnInit(): void {
    if (this.token !== null) {
      this.userData = JSON.parse(localStorage.getItem('user') || '');
      this.userData.Password = '';
      console.log(this.userData);
    }
  }

  /**
    * @description Sends user registration form information to the backend.
    * Closes the dialog on success and displays a success message. Shows an error message on failure.
    */

  // This is the function responsible for sending the form inputs to the backend
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((response) => {
      // Logic for a successful user registration goes here
      this.dialogRef.close(); // This will close the modal on success
      console.log(response);
      this.snackBar.open('user registered successfully', 'OK', {
        duration: 2000
      });
    }, (response) => {
      console.log(response);
      this.snackBar.open(response, 'OK', {
        duration: 2000
      });
    });
  }

  /**
     * This method will update the user's data
     * @returns user's data
     * @returns updated user's data saved to local storage
     * @returns user notified of success
     * @returns user notified of error
     */

  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((response) => {
      console.log(response);
      localStorage.setItem('user', JSON.stringify(response));
      this.dialogRef.close();
      this.snackBar.open('User updated successfully!', 'OK', { duration: 2000 });
    }, (response) => {
      console.log(response);
      this.snackBar.open(response, 'OK', { duration: 2000 });
    });
  }
}
