import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

export interface Page<T> {
  content: T[];
  page: {
    size: number,
    number: number,
    totalElements: number,
    totalPages: number
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl: string = 'http://localhost:8080';

  constructor(private readonly http: HttpClient) {
  }

  /**
   * Generic GET method
   * @param endpoint API endpoint (ex: 'users')
   * @param params Optional query params
   */
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params });
  }

  /**
   * Generic POST method
   * @param endpoint API endpoint (ex: 'users')
   * @param body Body data to be sent
   * @param params Optional query params
   */
  post<T>(endpoint: string, body: any, params?: HttpParams): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, { params });
  }

  /**
   * Generic PUT method
   * @param endpoint API endpoint (ex: 'users/1')
   * @param body Body data to be sent
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  /**
   * Generic DELETE method
   * @param endpoint API endpoint (ex: 'users/1')
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }
}
