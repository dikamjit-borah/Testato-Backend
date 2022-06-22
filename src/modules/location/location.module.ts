import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { LocationService } from './location.service';

@Module({
  imports:[
    HttpModule
  ],
  providers: [LocationService]
})
export class LocationModule {}
