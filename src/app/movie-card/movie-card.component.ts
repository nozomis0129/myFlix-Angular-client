import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

/**
 * @description Component representing the movie card.
 * @selector 'app-movie-card'
 * @templateUrl './movie-card.component.html'
 * @styleUrls ['./movie-card.component.scss']
 */

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})

export class MovieCardComponent implements OnInit {

  /** The movie data displayed in the card. */
  movies: any[] = [];
  user: any = {};
  userData = { Username: "", FavoriteMovies: [] };
  favorites: any[] = [];
  isFavMovies: boolean = false;

  //user = JSON.parse(localStorage.getItem('user') || '');

  /**
    * @constructor
    * @param {FetchApiDataService} fetchApiData - Service for handling shared data between components.
    * @param {MatDialog} dialog - Angular Material's MatDialog service for opening dialogs.
    * @param {MatSnackBar} snackBar - Angular Material's MatSnackBar service for notifications.  
    * @param {Router} router - Angular's Router service for navigation.
    */

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAllMovies();
    this.getFavorites();
  }

  /**
  * This will get all movies from the API
  * @returns movies
  */

  getAllMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /** 
   * Get user info and set favorites
   * @returns favorite movies selected by user
   * */

  getFavorites(): void {
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

  /**
    * Check if a movie is a user's favorite already
    * @param movieID
    * @returns boolean
    * */

  isFavoriteMovie(movieID: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieID) >= 0;
  }

  /**
   * Add a movie to a user's favorites 
   * Or remove on click if it is already a favorite
   * @param id 
   * @returns success message
   * */

  addToFavorites(id: string): void {
    if (this.isFavoriteMovie(id)) {
      // Movie is already a favorite, so remove it
      this.removeFavoriteMovies(id);
    } else {
      // Movie is not a favorite, so add it
      this.fetchApiData.addFavoriteMovies(id).subscribe(() => {
        this.snackBar.open('Movie added to favorites', 'OK', {
          duration: 2000,
        });
        this.getFavorites();
      });
    }
  }

  /**
  * This will remove movie from user's favorite list
  * @param id 
  * @returns suceess message
  * */

  removeFavoriteMovies(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('Movie has been deleted from your favorites!', 'OK', {
        duration: 2000,
      })
    });
  }

  /** 
 * Open director information from DirectorComponent
 * @param director (name, bio, birth, death)
 * @returns director name, bio, birth
 * */

  openDirectorDialog(name: string, bio: string, birth: string, death: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birth,
        Death: death
      },
      width: '450px',
    });
  }

  /** 
   *  Open genre information from GenreComponent 
   * @param genre (name, description)
   * @returns genres name and details
   * */

  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '450px',
    });
  }

  /** Open movie description from MovieDetailsComponent
  * @param description
  * @returns movie Title, Description
  * */

  openMovieDetailsDialog(description: string): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        Description: description,
      },
      width: '450px',
    });
  }

}