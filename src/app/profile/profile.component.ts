import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FetchApiDataService } from '../fetch-api-data.service';

import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { Observable } from 'rxjs';

/**
 * @description Component representing the navigation bar.
 * @selector 'app-profile'
 * @templateUrl './profile-page.component.html'
 * @styleUrls ['./profile-page.component.scss']
 */

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() userData = { Username: '', Email: '', Birthday: '', FavoriteMovies: [] };

  movies: any[] = [];
  user: any = {};
  FavoriteMovies: any[] = [];
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  /**
  * first this component loaded, it will load the current user data, update localstorage
  */

  ngOnInit(): void {
    this.getProfile();
    this.getFavMovies();
  }

  /**
  * Username and token will be taken from localstorage to send a request to the api for the users information
  * User profile page will then be able to display the users favorite movies list and their username, name, email, etc.
  * @returns user's data
  */

  getProfile(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.userData.Email = this.user.Email;
    this.userData.Birthday = this.user.Birthday;
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.FavoriteMovies = response.filter((movie: any) => this.user.FavoriteMovies.includes(movie._id));
    })

  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((result) => {
      console.log('User update successful', result);
      localStorage.setItem('user', JSON.stringify(result));
      this.snackBar.open('User update successful', 'OK', {
        duration: 2000
      });
    }, (error) => {
      console.error('Error updating uer:', error);
      this.snackBar.open('Fail to update user', 'OK', {
        duration: 2000
      });
    });
  }

  /**
     * This method will delete the user's account
     * @returns confirmation prompt
     * @returns user's account deleted
     * @returns user navigated to welcome page
     * @returns user notified of success
     * @returns user notified of error
     * @returns user token and user details removed from local storage
     */

  deleteUser(): void {
    if (confirm('Do you want to delete your account?')) {
      this.router.navigate(['welcome']).then(() => {
        localStorage.clear();
        this.snackBar.open('Your account has been deleted', 'OK', {
          duration: 3000
        });
      })
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
      });
    }
  }

  /**
  * @description retrieves all the movies
  */

  getAllMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
 * @description displays movie genre and description
 * @param name description
 */

  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      width: '400px',
      height: '300px',
      data: { Name: name, Description: description }
    });
  }

  /**
* @description displays movie director and description
* @param director
*/

  openDirectorDialog(name: string, bio: string, birth: string, death: string): void {
    this.dialog.open(DirectorComponent, {
      width: '400px',
      height: '300px',
      data: { Name: name, Bio: bio, Birth: birth, Death: death }
    });
  }

  /**
   * @description displays movie details and description
   * @param description
   */

  openMovieDetailsDialog(description: string): void {
    this.dialog.open(MovieDetailsComponent, {
      width: '400px',
      height: '300px',
      data: { Description: description }
    })
  }

  /**
  * @description gets a list of favorite movies
  */

  getFavMovies(): void {
    this.fetchApiData.getUser().subscribe(
      (resp: any) => {
        if (resp.user && resp.user.FavoriteMovies) {
          this.favorites = resp.user.FavoriteMovies;
        } else {
          this.favorites = [];
        }
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
        this.favorites = [];
      }
    );
  }

  isFav(movieID: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieID) >= 0;
  }

  /**
   * @description adds a movie to the users list of favorite movies
   * @param id
   */

  addToFavorites(id: string): void {
    if (this.isFav(id)) {
      // Movie is already a favorite, so remove it
      this.deleteFavMovies(id);
    } else {
      // Movie is not a favorite, so add it
      this.fetchApiData.addFavoriteMovies(id).subscribe(() => {
        this.snackBar.open('Movie added to favorites', 'OK', {
          duration: 2000,
        });
        this.getFavMovies();
      });
    }
  }

  /**
   * @description delete a movie from the users list of favorite movies
   * @param id
   */

  deleteFavMovies(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('removed from favorites', 'OK', {
        duration: 2000
      })
    });
  }
}
