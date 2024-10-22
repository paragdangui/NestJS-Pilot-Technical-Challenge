import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1729588343280 implements MigrationInterface {
    name = 'UpdateSchema1729588343280'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`passwordLastChangedAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`passwordExpired\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`passwordExpired\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`passwordLastChangedAt\``);
    }

}
