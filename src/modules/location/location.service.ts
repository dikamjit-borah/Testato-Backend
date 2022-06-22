import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
const xml2js = require('xml2js');

@Injectable()
export class LocationService {

    constructor(private readonly httpService: HttpService) {

    }


    async reverseGeocodeForCity(latitude?: number, longitude?: number) {

        const results = await this.fetchCityName()
        return results
    }

    async fetchCityName(){

        const url = `https://nominatim.openstreetmap.org/reverse?format=xml&lat=26.1158&lon=91.7086`
        const responseDataInXml = await firstValueFrom(
            this.httpService.get(url).pipe(map((response) => [response.data, response.status])),
        );

        return new Promise((resolve, reject)=>{
            xml2js.parseString(responseDataInXml, (err, result) => {
                let cityFound = false
                if (err) {
                    reject({
                        cityFound,
                        error: err
                    })
                }
                try {
                    const city = result['reversegeocode']['addressparts'][0]['city'][0];
                    cityFound = true
                    resolve( {
                        cityFound,
                        city
                    })
    
                } catch (error) {
                    reject({
                        cityFound,
                        error
                    })
                }
            });
        })
    }

    calculateDistance(latitude1: number, longitude1: number, latitude2: number, longitude2: number) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(latitude2-latitude1);  // deg2rad below
        var dLon = this.deg2rad(longitude2-longitude1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(this.deg2rad(latitude1)) * Math.cos(this.deg2rad(latitude2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var distance = R * c; // Distance in km

        return {distance, unit:"km"};

    }

    deg2rad(deg) {
        return deg * (Math.PI/180)
      }
    
}
