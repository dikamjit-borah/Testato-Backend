import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class LocationService {

    constructor(private readonly httpService: HttpService) {

    }

    async reverseGeocoding(latitude?: number, longitude?: number) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=xml&lat=26.1158&lon=91.7086`
        const responseData = await firstValueFrom(
            this.httpService.get(url).pipe(map((response) => [response.data, response.status])),
        );
        return responseData
    }

    async calculateDistance(latitude: number, longitude: number){
        
    }
}
