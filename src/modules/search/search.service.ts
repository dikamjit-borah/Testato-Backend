require('dotenv').config()
import { Injectable } from '@nestjs/common';

const algoliasearch = require('algoliasearch')
const client = algoliasearch(process.env.ALG_APP_KEY, process.env.ALG_ADMIN_KEY)

import { config } from 'src/utils/config';


@Injectable()
export class SearchService {
    constructor(){
    }

    async updateMedicinesInSe(records: Array<any>){

        let medicinesUpdated:boolean = false
        try {
            if(records && records.length>0){
            const index = client.initIndex(config.algolia.searchIndex)
            await index.saveObjects(records);
            index
            medicinesUpdated = true
            return {
                medicinesUpdated
            }
        }
            
        } catch (error) {
            return {
                error
            }
        }
        
    }

    async searchMedicineInSe(queryString: string, viewAllAvailablePharmacies?: any, city?: string)
    {
        viewAllAvailablePharmacies = viewAllAvailablePharmacies === 'true' ? true : false
        let searched = false;
        console.log(`Searching for ${queryString} in Algolia`);
        const index = client.initIndex('medicinePharmacySearchIndex')
        try {
            const results = await index.search(queryString, {filters: viewAllAvailablePharmacies ? '' : `city:${city}`})
            const hits = results['hits'].map(({_highlightResult, ...rest})=>{
                return rest
            })
            
            const pharmacies = hits.map(hit=>{
                return hit['pharmacyId']
            })

            searched = true
            return {
                searched,
                hits, 
                pharmacies
            }
        } catch (error) {
            return {
                searched,
                error
            }
        }
    }

}
