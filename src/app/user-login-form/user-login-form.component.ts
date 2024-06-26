// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// Close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls
import { FetchApiDataService } from '../fetch-api-data.service';

// Display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }
  ngOnInit(): void {
  }

  /**
     * This is the function responsible for sending the form inputs to the backend
     * @returns user logged in
     * @returns user navigated to movies view
     * @returns user token and user details saved to local storage
     * @returns user notified of success
     * @returns user notified of error
     */

  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      // Logic for a successful user registration goes here
      console.log(result);
      localStorage.setItem('user', result.user.Username);
      localStorage.setItem('token', result.token);
      this.dialogRef.close(); // This will close the modal on success
      console.log(result);
      this.snackBar.open('user logged in successfully', 'OK', {
        duration: 2000
      });
      this.router.navigate(['movies']);
    }, (result) => {
      console.log(result);
      this.snackBar.open('login failed', 'OK', {
        duration: 2000
      });
    });
  }

}
