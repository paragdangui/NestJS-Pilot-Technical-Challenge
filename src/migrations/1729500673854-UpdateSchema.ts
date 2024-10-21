import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1729500673854 implements MigrationInterface {
    name = 'UpdateSchema1729500673854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`failedAttempts\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`lockUntil\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`lockUntil\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`failedAttempts\``);
    }

}
