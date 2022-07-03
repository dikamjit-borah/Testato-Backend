require('dotenv').config()
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const typeormConfig : TypeOrmModuleOptions ={
  type: process.env.DB_TYPE as any, 
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as any,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === "development"? true:false,
  logging: true,

  //entities: [__dirname + '/../**/*.entity.{js,ts}'],
  entities: [__dirname + '/../**/*.entity.js'],
  migrations: ['dist/src/db/migrations/*.js'],
  migrationsTableName: process.env.DB_MIGRATION
  } 

  export default typeormConfig;