import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
const xml2js = require('xml2js');

@Injectable()
export class LocationService {

    constructor(private readonly httpService: HttpService) {

    }


    async reverseGeocodeForCity(latitude: number, longitude: number) {

        try {
            const results = await this.fetchCityName(latitude, longitude)
            return results
        } catch (error) {
            return ''
        }
    }

    async fetchCityName(latitude: number, longitude: number){

        //const url = `https://nominatim.openstreetmap.org/reverse?format=xml&lat=${latitude}&lon=${longitude}`

        const url  = `https://apis.mapmyindia.com/advancedmaps/v1/${process.env.MMI_API_KEY}/rev_geocode?lat=${latitude}&lng=${longitude}&region=IND`
        console.log(`Fetching city name from ${url}`);
        /* const responseDataInXml = await firstValueFrom(
            this.httpService.get(url).pipe(map((response) => [response.data, response.status])),
        ); */

        const responseData = await firstValueFrom(
            this.httpService.get(url).pipe(map((response) => [response.data, response.status])),
        );

        console.log(JSON.stringify(responseData));
        console.log(responseData[0]['results'][0]['city']);
        
        

        return responseData[0]['results'][0]['city']

       /*  return new Promise((resolve, reject)=>{
            xml2js.parseString(responseDataInXml, (err, result) => {
                let cityFound = false
                if (err) {
                    reject({
                        cityFound,
                        error: err
                    })
                }
                try {
                    let city = result['reversegeocode']['addressparts'][0]['city'][0];
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
        }) */
    }

    calculateDistance(latitude1: number, longitude1: number, latitude2: number, longitude2: number) {
        let R = 6371; // Radius of the earth in km
        let dLat = this.deg2rad(latitude2-latitude1);  // deg2rad below
        let dLon = this.deg2rad(longitude2-longitude1); 
        let a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(this.deg2rad(latitude1)) * Math.cos(this.deg2rad(latitude2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        let distance = R * c; // Distance in km
         
        return {distance: distance.toFixed(), unit:"km"};

    }

    deg2rad(deg) {
        return deg * (Math.PI/180)
      }
    
}
