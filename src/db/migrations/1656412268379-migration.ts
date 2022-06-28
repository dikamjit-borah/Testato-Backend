import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1656412268379 implements MigrationInterface {
    name = 'migration1656412268379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_entity\` (\`phone_number\` bigint NOT NULL, \`password\` varchar(255) NOT NULL, \`user_type\` varchar(255) NOT NULL, PRIMARY KEY (\`phone_number\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`medicine_entity\` (\`medicine_id\` varchar(255) NOT NULL, \`medicine_name\` varchar(255) NOT NULL, \`available_pharmacies\` longtext NOT NULL, PRIMARY KEY (\`medicine_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`medicine_details_entity\` (\`medicine_id\` varchar(255) NOT NULL, \`medicine_name\` varchar(255) NOT NULL, \`medicine_mrp\` float NULL, \`medicine_manufacturer\` varchar(255) NULL, \`medicine_composition\` varchar(255) NULL, \`medicine_packing_type\` varchar(255) NULL, \`medicine_packaging\` varchar(255) NULL, PRIMARY KEY (\`medicine_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_details_entity\` (\`phone_number\` bigint NOT NULL, \`user_name\` varchar(255) NOT NULL, \`latitude\` float NOT NULL, \`longitude\` float NOT NULL, \`address\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`state\` varchar(255) NOT NULL, PRIMARY KEY (\`phone_number\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user_details_entity\``);
        await queryRunner.query(`DROP TABLE \`medicine_details_entity\``);
        await queryRunner.query(`DROP TABLE \`medicine_entity\``);
        await queryRunner.query(`DROP TABLE \`user_entity\``);
    }

}
