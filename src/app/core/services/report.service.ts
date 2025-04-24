import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly url = `${environment.apiUrl}/reports/low-inventory`;

  constructor(private http: HttpClient) {}

  downloadLowInventoryReport(): Observable<Blob> {
    return this.http.get(this.url, { responseType: 'blob' });
  }
}
