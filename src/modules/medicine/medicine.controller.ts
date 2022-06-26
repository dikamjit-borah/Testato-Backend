import { Controller, Get, HttpStatus, Logger, Query, Res } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { MedicineDto } from 'src/dto/MedicineDto';
import { BasicUtils } from 'src/utils/BasicUtils';
import { Constants } from 'src/utils/Constants';
import { LocationService } from '../location/location.service';
import { SearchService } from '../search/search.service';
import { UserService } from '../user/user.service';
import { MedicineService } from './medicine.service';

@Controller('medicine')
export class MedicineController {

    constructor(
        private medicineService: MedicineService, 
        private userService: UserService, 
        private locationService: LocationService,
        private searchService: SearchService) {

    }



    // @UseGuards(JwtGuardForAuth)
    /* @Get(':id')
    async findMedicineById(@Query('id') id: number) {
       
        return {
            statusCode: 600,
            message: "all good"
        }
    } */

    @Get('search')
    async search(@Query('queryString') queryString: string, @Res() res) {
        console.log("Search initiated for " + queryString);
        let results = await this.medicineService.searchMedicineInDb(queryString)
        if (results) {
            if (results['medicineFound'] && results['medicines']) {
                if (results['medicines'].length > 0) return res.status(HttpStatus.OK).send(BasicUtils.generateResponse(HttpStatus.OK, Constants.Messages.MEDICINES_FOUND, { results: results['medicines'] }))
                return res.status(HttpStatus.OK).send(BasicUtils.generateResponse(HttpStatus.OK, Constants.Messages.MEDICINES_NOT_FOUND))
            }
            if (results['error'])
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(BasicUtils.generateResponse(HttpStatus.INTERNAL_SERVER_ERROR, results['error']))
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(BasicUtils.generateResponse())
    }

    @Get('algolia/search')
    async algoliaSearch(@Query('queryString') queryString: string, @Res() res) {
        console.log("Search initiated for " + queryString);

        let results = await this.searchService.searchMedicineInSe(queryString)
        console.log(results);
        
        if (results) {
            if (results['searched'] && results['hits']) {
                if (results['hits'].length > 0) return res.status(HttpStatus.OK).send(BasicUtils.generateResponse(HttpStatus.OK, Constants.Messages.MEDICINES_FOUND, { results: results['hits'] }))
                return res.status(HttpStatus.OK).send(BasicUtils.generateResponse(HttpStatus.OK, Constants.Messages.MEDICINES_NOT_FOUND))
            }
            if (results['error'])
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(BasicUtils.generateResponse(HttpStatus.INTERNAL_SERVER_ERROR, results['error']))
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(BasicUtils.generateResponse())
    }

    @Get('find')
    async find(@Query('medicineId') medicineId: string, @Res() res) {
        console.log("Fetching details for " + medicineId);

        const data = await this.medicineService.fetchMedicineDetails(medicineId)

        if (data) {
            if (data['detailsAvailable'] && data['medicineDetails']) {
                return res.status(HttpStatus.OK).send(BasicUtils.generateResponse(HttpStatus.OK, Constants.Messages.MEDICINE_DETAILS_FOUND, { medicineDetails: data['medicineDetails'] }))
            }
            if (data['error'])
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(BasicUtils.generateResponse(HttpStatus.INTERNAL_SERVER_ERROR, data['error']))
            else return res.status(HttpStatus.OK).send(BasicUtils.generateResponse(HttpStatus.OK, Constants.Messages.MEDICINE_DETAILS_NOT_FOUND))
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(BasicUtils.generateResponse())
    }

    @Get('availablePharmacies')
    async availablePharmacies(
        @Query('medicineId') medicineId: string,
        @Query('userLatitude') userLatitude: number,
        @Query('userLongitude') userLongitude: number,
        @Query('viewAllAvailablePharmacies') viewAllAvailablePharmacies: string,
        @Res() res) {

        console.log("Finding available pharmacies for "+ medicineId);
        
        const results = await this.medicineService.fetchAvailablePharmacies(medicineId)
        if(results){
            if (results['pharmaciesFound'] && results['availablePharmacies']) {
                const detailsOfPharmacies = await this.generateDetailsOfPharmacies(viewAllAvailablePharmacies, results['availablePharmacies'] as string, userLatitude, userLongitude)
                if (detailsOfPharmacies && detailsOfPharmacies.length > 0) {
                    
                    const detailsOfPharmaciesWithDistance = detailsOfPharmacies.map(pharmacy => {
                        let results =  this.locationService.calculateDistance(userLatitude, userLongitude, pharmacy['latitude'], pharmacy['longitude'])
                        return {...pharmacy, distance: results['distance'], unit: results['unit']}
                    })
                    return res.status(HttpStatus.OK).send(BasicUtils.generateResponse(HttpStatus.OK, Constants.Messages.PHARMACIES_AVAILABLE, { pharmacies: detailsOfPharmaciesWithDistance }))
                }
               
            }
            else if(results['error']) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(BasicUtils.generateResponse(HttpStatus.INTERNAL_SERVER_ERROR, Constants.Messages.PHARMACIES_NOT_AVAILABLE, {error: results['error']}))
            else if(results['pharmaciesFound'] === false) return res.status(HttpStatus.OK).send(BasicUtils.generateResponse(HttpStatus.OK, Constants.Messages.PHARMACIES_NOT_AVAILABLE))
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(BasicUtils.generateResponse())
    }

    @Get('algolia/availablePharmacies')
    async algoliaAvailablePharmacies(
        @Query('medicineName') medicineName: string,
        @Query('userLatitude') userLatitude: number,
        @Query('userLongitude') userLongitude: number,
        @Query('viewAllAvailablePharmacies') viewAllAvailablePharmacies: any,
        @Res() res) {

        console.log("Finding available pharmacies for "+ medicineName);
        
        viewAllAvailablePharmacies = viewAllAvailablePharmacies === 'true' ? true : false
        let city = ''
        
        if(!viewAllAvailablePharmacies && userLatitude && userLongitude){
            const results = await this.locationService.reverseGeocodeForCity(userLatitude, userLongitude)
            console.log("City" + results);
            city = results ? results : ''
        }else viewAllAvailablePharmacies = true
       
        const searchResults = await this.searchService.searchMedicineInSe(medicineName, viewAllAvailablePharmacies, city)
        
        if(searchResults){
            if (searchResults['searched'] && searchResults['pharmacies'] && searchResults['pharmacies'].length>0) {
                const detailsOfPharmacies = await this.fetchDetailsOfPharmacies(searchResults['pharmacies'])
                if(detailsOfPharmacies){
                    const pharmacyDetails = detailsOfPharmacies['pharmacyDetails']
                    let detailsOfPharmaciesWithDistance = []
                    if(pharmacyDetails && pharmacyDetails.length>0){
                        detailsOfPharmaciesWithDistance = pharmacyDetails.map(pharmacy => {
                            let searchResults =  this.locationService.calculateDistance(userLatitude, userLongitude, pharmacy['latitude'], pharmacy['longitude'])
                            return {...pharmacy, distance: searchResults['distance'], unit: searchResults['unit']}
                        })
                    }
                    return res.status(HttpStatus.OK).send(BasicUtils.generateResponse(HttpStatus.OK, Constants.Messages.PHARMACIES_AVAILABLE, { pharmacies: detailsOfPharmaciesWithDistance }))
                }
                else if(searchResults['error']) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(BasicUtils.generateResponse(HttpStatus.INTERNAL_SERVER_ERROR, Constants.Messages.PHARMACIES_NOT_AVAILABLE, {error: searchResults['error']}))
            }

            if(!searchResults['searched']){
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(BasicUtils.generateResponse(HttpStatus.INTERNAL_SERVER_ERROR, Constants.Messages.PHARMACIES_NOT_AVAILABLE))                
            }
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(BasicUtils.generateResponse())
    }

    async fetchDetailsOfPharmacies(pharmacies){
        let pharmacyDetails = []
        let errors = []
        await Promise.all(
            pharmacies.map(async pharmacy => {
                const userDetails = await this.userService.fetchUserDetails(pharmacy)
                if (userDetails) 
                {
                    if(userDetails['detailsAvailable'] && userDetails['userDetails']) pharmacyDetails.push(userDetails['userDetails'])
                    if(userDetails['error']) errors.push(userDetails['error']) 
                }
            }))
            return {
                pharmacyDetails,
                errors
            }
    }
    
    async generateDetailsOfPharmacies(viewAllAvailablePharmacies: string, availablePharmacies: string, userLatitude:number, userLongitude:number) {
        const allPharmacies = [...new Set(availablePharmacies.split(','))]
        if (viewAllAvailablePharmacies == 'true') {
            {
                const detailsOfAllPharmacies = []

                if (allPharmacies) {
                    await Promise.all(
                        allPharmacies.map(async pharmacy => {
                            const userDetails = await this.userService.fetchUserDetails(pharmacy)
                            if (userDetails) 
                            {
                                if(userDetails['detailsAvailable'] && userDetails['userDetails']) detailsOfAllPharmacies.push(userDetails['userDetails'])
                                if(userDetails['error']) return 
                            }
                        }))
                }
                return detailsOfAllPharmacies;
            }
        }
        else{
            const detailsOfNearbyPharmacies = []
            const results = await this.locationService.reverseGeocodeForCity(userLatitude, userLongitude)
            console.log("poko", JSON.stringify(results));
            
            if(results){
                if(results['cityFound'] && results['city']){
                    const userCity = results['city']
                    const userDetails = await this.userService.fetchUserDetailsByCity(userCity)
                
                }
            }
            return detailsOfNearbyPharmacies;
            
        }
    }

    @MessagePattern(Constants.RabbitMqConfig.MEDICINE_DATA_PATTERN)
    async updateMedicineData(@Ctx() context: RmqContext) {

        console.log("Fetching updated medicine data from rabbitmq");

        let { content } = context.getMessage()
        const channel = context.getChannelRef();
        content = JSON.parse(content.toString())

        const data = content && content.data ? content.data : null
        const pharmacyId = data && data['pharmacyId'] ? data['pharmacyId'] : null
        const medicineData = data && data['medicineData'] ? data['medicineData'] : null

        if (pharmacyId) {
            console.log("Parsing medicine data for " + pharmacyId);
            let medicineDtoList: MedicineDto[] = []
            let medicinePharmacySearchList = []
            if (medicineData && Array.isArray(medicineData) && medicineData.length != 0) {
                for (let i = 0; i < medicineData.length; i++) {
                    let medicine = medicineData[i];
                    let medicineDto: MedicineDto = new MedicineDto()
                    let medicinePharmacySearchItem = {}


                    medicineDto.medicineId = medicine['Product ID']
                    medicinePharmacySearchItem['medicineId'] = medicineDto.medicineId

                    medicineDto.medicineName = medicine['Product Name']
                    medicinePharmacySearchItem['medicineName'] = medicineDto.medicineName

                    medicinePharmacySearchItem['objectID'] = "ALG" + medicineDto.medicineId + pharmacyId

                    medicineDto.medicineMrp = medicine['MRP (₹)']
                    medicineDto.medicineComposition = medicine['Composition']
                    medicineDto.medicineManufacturer = medicine['Manufacturer']
                    medicineDto.medicinePackingType = medicine['Packing Type']
                    medicineDto.medicinePackaging = medicine['Packaging']

                    medicineDto.availablePharmacies = pharmacyId
                    medicinePharmacySearchItem['pharmacyId'] = pharmacyId
                    const pharmacyCity = await this.userService.fetchUserCity(pharmacyId)
                    medicinePharmacySearchItem['city'] = pharmacyCity ? pharmacyCity : "N/A"

                    medicineDtoList.push(medicineDto)
                    medicinePharmacySearchList.push(medicinePharmacySearchItem)

                }
                let isMedicinesUpdatedInDb = await this.medicineService.updateMedicinesInDb(medicineDtoList)
                if (isMedicinesUpdatedInDb['medicinesUpdated']) {
                    console.log("Medicines updated in database successfully");
                } else if (isMedicinesUpdatedInDb['error']) console.log("Medicines could not be in database updated due to " + isMedicinesUpdatedInDb['error']);

                let isMedicinesUpdatedInSe = await this.searchService.updateMedicinesInSe(medicinePharmacySearchList)
                if (isMedicinesUpdatedInSe['medicinesUpdated']) {
                    console.log("Medicines updated in search engine successfully");
                    // channel.ack(context.getMessage())
                    // console.log("Ack sent");
                } else if (isMedicinesUpdatedInSe['error']) console.log("Medicines could not be in updated in search engine due to " + isMedicinesUpdatedInSe['error']);

                channel.ack(context.getMessage())
                console.log("Ack sent");
            }
        }
    }

}
