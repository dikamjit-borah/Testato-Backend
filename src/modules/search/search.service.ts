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

    async searchMedicineInSe(queryString: string, viewAllAvailablePharmacies?: boolean, city?: string)
    {
        let searched = false;
        console.log("View all available pharmacies" + viewAllAvailablePharmacies);
        
        console.log(`Searching for ${queryString} in Algolia`);
        const index = client.initIndex('medicinePharmacySearchIndex')
        try {
            const results = await index.search(queryString, !viewAllAvailablePharmacies && city ? {filters: `city:${city}`} : null)

            console.log(results);
            
            if(results){
                const hits = results['hits'].map(({_highlightResult, ...rest})=>{
                    return rest
                })
                
                const pharmacies = [...new Set(hits.map(hit=>{
                    return hit['pharmacyId']
                }))]
    
                searched = true
                return {
                    searched,
                    hits, 
                    pharmacies
                }
            }
            return {
                searched,
            }
            
        } catch (error) {
            return {
                searched,
                error
            }
        }
    }

}
