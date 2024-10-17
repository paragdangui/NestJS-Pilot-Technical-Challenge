import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1729152821785 implements MigrationInterface {
    name = 'UpdateSchema1729152821785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`middle_name\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`middle_name\` varchar(255) NOT NULL`);
    }

}
