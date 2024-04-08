import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";

@Injectable()
export class ApiService {
  private _isLoading: BehaviorSubject<boolean>= new BehaviorSubject(false);

  public readonly isLoading = this._isLoading.asObservable();

  private baseUrl = "http://localhost:4818";
  private httpOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };

  handleError(error: HttpErrorResponse) {
    this.setLoadingFlag(false);
    let message: string | undefined = undefined;
    if (error.status === 0) {
      message = "Unknown error!";
    }
    if (error.error.message === "Validation error") {
      message = Object.values(error.error.errors)[0] as string;
    } else if (error.error.message) {
      message = error.error.message;
    }
    if (!message) {
      message = error.message || "Unkonwn error!";
    }
    return throwError(() =>{  return { message }});
  }

  constructor(private client: HttpClient) {
    this.handleError = this.handleError.bind(this);
  }

  private setLoadingFlag(value: boolean) {
    this._isLoading.next(value);
  }

  get<T>(path: string, options?: any) {
    this._isLoading.next(true);
    return this.client.get<T>(`${this.baseUrl}${path}`, {
      ...this.httpOptions,
      ...options,
    }).pipe(
      tap(() => this.setLoadingFlag(false)),
      catchError(this.handleError),
    );
  }
  post<T>(path: string, payload?: any, options?: any) {
    if (!path.includes("auth")) this._isLoading.next(true);
    return this.client.post<T>(`${this.baseUrl}${path}`, payload, {
      ...this.httpOptions,
      ...options,
    }).pipe(
      tap(() => this.setLoadingFlag(false)),
      catchError(this.handleError),
    );
  }
  put<T>(path: string, payload?: any, options?: any) {
    this._isLoading.next(true);
    return this.client.put<T>(`${this.baseUrl}${path}`, payload, {
      ...this.httpOptions,
      ...options,
    }).pipe(
      tap(() => this.setLoadingFlag(false)),
      catchError(this.handleError),
    );
  }

  delete<T>(path: string, options?: any) {
    this._isLoading.next(true);
    return this.client.delete<T>(`${this.baseUrl}${path}`, {
      ...this.httpOptions,
      ...options,
    }).pipe(
      tap(() => this.setLoadingFlag(false)),
      catchError(this.handleError),
    );
  }
}
