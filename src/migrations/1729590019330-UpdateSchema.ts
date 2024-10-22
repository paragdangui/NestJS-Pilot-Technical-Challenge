import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1729590019330 implements MigrationInterface {
    name = 'UpdateSchema1729590019330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`passwordHistory\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`passwordHistory\``);
    }

}
