require('dotenv').config()
import { DataSource } from "typeorm";

export default new DataSource({
    type: process.env.DB_TYPE as any, 
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as any,
    username: process.env.DB_USERNAME,
    password: "",
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV === "development"? false:false,
    logging:true,
    
    entities: [__dirname + '/../**/*.entity.js'],
    migrations: ['dist/src/db/migrations/*.js'],
    migrationsTableName: process.env.DB_MIGRATION
    })