import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

@Injectable()
export class ApiService {
  private baseUrl = "http://localhost:4818";

  private httpOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };

  handleError(error: HttpErrorResponse) {
    console.log(error);
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
    return throwError(() => ({ message }));
  }

  constructor(private client: HttpClient) {}

  get<T>(path: string, options?: any) {
    return this.client.get<T>(`${this.baseUrl}${path}`, {
      ...this.httpOptions,
      ...options,
    }).pipe(
      catchError(this.handleError),
    );
  }
  post<T>(path: string, payload?: any, options?: any) {
    return this.client.post<T>(`${this.baseUrl}${path}`, payload, {
      ...this.httpOptions,
      ...options,
    }).pipe(
      catchError(this.handleError),
    );
  }
  put<T>(path: string, payload?: any, options?: any) {
    return this.client.put<T>(`${this.baseUrl}${path}`, payload, {
      ...this.httpOptions,
      ...options,
    }).pipe(
      catchError(this.handleError),
    );
  }

  delete<T>(path: string, options?: any) {
    return this.client.delete<T>(`${this.baseUrl}${path}`, {
      ...this.httpOptions,
      ...options,
    }).pipe(
      catchError(this.handleError),
    );
  }
}
