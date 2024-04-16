import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = "https://movies-flix-app-bb16fed0a4c0.herokuapp.com/";

@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {

  private userData = new BehaviorSubject<Object>({ Username: '', Password: '', Email: '', Birthday: '' });
  currentUser = this.userData.asObservable();

  private movies = new BehaviorSubject<Object>({});
  moviesList = this.movies.asObservable();

  /**
   * @constructor
   * @param {HttpClient} http - Angular's HttpClient module for making HTTP requests. 
   */

  constructor(private http: HttpClient) { }

  /**
   * @description Make an API call for user registration.
   * @param {any} userDetails - User details for registration.
   * @returns {Observable<any>} - Observable for the API response.
   */

  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * @description Make an API call for user login.
   * @param {any} userDetails - User details for login. 
   * @returns {Observable<any>} - Observable for the API response containing the user token.
   */

  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * @description Make an API call to retrieve all movies.
   * @returns {Observable<any>} - Observable for the API response containing all movies.
   */

  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
    * @description Make an API call to retrieve a single movie.
    * @param {string} title - title of the movie to be retrieved.
    * @returns {Observable<any>} - Observable for the API response containing the requested movie.
    */

  public getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
    * @description Make an API call to retrieve a director by name.
    * @param {string} directorName - Name of the director to be retrieved.
    * @returns {Observable<any>} - Observable for the API response containing the requested director.
    */

  public getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + directorName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @description Make an API call to retrieve a genre by name.
   * @param {string} genreName - Name of the genre to be retrieved.
   * @returns {Observable<any>} -  Observable for the API response containing the requested genre.
   */

  public getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genreName' + genreName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @description Making the API call for getting user endpoint.
   * @throws error
   */

  public getAllUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer' + token,
        }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @description Making the API call for getting user endpoint
   * @returns user's details
   * @throws error
   */

  public getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http.get(apiUrl + 'users/' + user, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer' + token,
        }
      )
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @description Method to user's fav movies
   * @returns user's fav movies
   * @throws error
   */

  public getFavoriteMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }

  /**
   * @description Make an API call to add a favorite movie for a user.
   * @param {string} MovieID - ID of the movie to be added to fav list.
   * @returns {Observable<any>} - Observable for the API response.
   */

  public addFavoriteMovies(MovieID: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    user.FavoriteMovies.push(MovieID)
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + MovieID, {}, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  isFavoriteMovie(MovieID: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(MovieID) >= 0;
  }

  /**
   * @description Make an API call to edit user infoprmation.
   * @param {any} updatedUser - New user information
   * @returns {Observable<any>} - Obsevable for the API response.
   */

  public editUser(updatedUser: any): Observable<any> {
    console.log(updatedUser);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @description Make an API call to delete a user.
   * @returns {Observable<any>} - Observable for the API response.
   */

  public deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @description Make an API call to delete a favorite movie from the list.
   * @param {string} MovieID - ID of the movie to be deleted from the favrite list.
   * @returns {Observable<any>} - Observable for the API response.
   */

  public deleteFavoriteMovie(MovieID: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    console.log('in fetch api service: ', MovieID);
    return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + MovieID, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @description Extract non-typed response data from the API response.
   * @param body = res; 
   * @returns {any} - Extracted response data.
   * @private
   */

  private extractResponseData(res: Response | Object): any {
    const body = res;
    return body || {};
  }

  /**
   * @description Handle HTTP errors and log them.
   * @param {HttpErrorResponse} error - HTTP error response.
   * @returns {any} - Error details.
   * @private
   */

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
