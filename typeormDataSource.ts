require('dotenv').config()
import { join } from "path";
import { DataSource } from "typeorm";

export default new DataSource({
    type: process.env.DB_TYPE as any, 
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as any,
    username: process.env.DB_USERNAME,
    password: "",
    database: process.env.DB_DATABASE,
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: process.env.NODE_ENV === "development"? false:false,
    migrations:[
       __dirname+'/../migrations/**/*{.ts,.js}'
    ]
    })