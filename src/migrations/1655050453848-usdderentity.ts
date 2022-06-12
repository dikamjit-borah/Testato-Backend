import { MigrationInterface, QueryRunner } from "typeorm";

export class usdderentity1655050453848 implements MigrationInterface {
    name = 'usdderentity1655050453848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_entity\` ADD \`clientId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_entity\` CHANGE \`phoneNumber\` \`phoneNumber\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_entity\` CHANGE \`password\` \`password\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_entity\` CHANGE \`phoneNumber\` \`phoneNumber\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_entity\` CHANGE \`password\` \`password\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_entity\` CHANGE \`password\` \`password\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_entity\` CHANGE \`phoneNumber\` \`phoneNumber\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_entity\` CHANGE \`password\` \`password\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_entity\` CHANGE \`phoneNumber\` \`phoneNumber\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_entity\` DROP COLUMN \`clientId\``);
    }

}
