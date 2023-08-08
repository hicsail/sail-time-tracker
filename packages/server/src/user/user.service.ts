import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private readonly configService: ConfigService, private httpService: HttpService) {}

  async getUser(token: string) {
    const graphqlQuery = `query { me { email } }`;

    const serverBUrl = this.configService.get('AUTH_URI');
    const { data } = await firstValueFrom(
      this.httpService.get(serverBUrl, {
        params: {
          query: graphqlQuery
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
    );

    return data.data.me;
  }
}
