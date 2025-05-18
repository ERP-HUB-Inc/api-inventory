import { ConfigGateway } from '../common/config/config.gateway';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StockHttpService {
  constructor(
    private readonly http: HttpService,
    private readonly configGateway: ConfigGateway,
  ) {}

  async forwardRequest(
    method: string,
    path: string,
    body?: any,
    query?: any,
    headers?: any,
  ): Promise {
    const baseUrl = await this.configGateway.get('SERVICE_URL');
    const url = `${baseUrl}${path}`;

    const config: AxiosRequestConfig = {
      method: method as any,
      url,
      headers,
      params: query,
      data: body,
    };

    const response = await firstValueFrom(this.http.request(config));
    return response.data;
  }
}
