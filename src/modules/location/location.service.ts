import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
var convert = require('xml-js');
var parser = require('fast-xml-parser');
const xml2js = require('xml2js');

@Injectable()
export class LocationService {

    constructor(private readonly httpService: HttpService) {

    }


    async reverseGeocodeForCity(latitude?: number, longitude?: number) {

        const url = `https://nominatim.openstreetmap.org/reverse?format=xml&lat=26.1158&lon=91.7086`
        const responseDataInXml = await firstValueFrom(
            this.httpService.get(url).pipe(map((response) => [response.data, response.status])),
        );

        var results = xml2js.parseString(responseDataInXml, async (err, result) => {
            let cityFound = false
            if (err) {
                return {
                    cityFound,
                    error: err
                }
            }
            try {
                const city = result['reversegeocode']['addressparts'][0]['city'][0];
                console.log("yyyo0", city);
                
                cityFound = true
                return {
                    cityFound,
                    city
                }

            } catch (error) {
                return {
                    cityFound,
                    error
                }
            }
        });
        console.log("pokkkkk", results);
        
        return results
    }

    async calculateDistance(latitude: number, longitude: number) {

    }
}
