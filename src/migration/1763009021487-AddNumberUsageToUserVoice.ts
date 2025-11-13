import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNumberUsageToUserVoice1763009021487 implements MigrationInterface {
    name = 'AddNumberUsageToUserVoice1763009021487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_6cce72f5e685eb39410487b31c"`);
        await queryRunner.query(`ALTER TABLE "user_voices" ADD "number_usage" bigint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`CREATE INDEX "IDX_81f2716f3edca10f72c57b6ab5" ON "user_voices" ("mezon_user_id", "voice_name", "number_usage", "is_default", "voice_path", "is_private") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_81f2716f3edca10f72c57b6ab5"`);
        await queryRunner.query(`ALTER TABLE "user_voices" DROP COLUMN "number_usage"`);
        await queryRunner.query(`CREATE INDEX "IDX_6cce72f5e685eb39410487b31c" ON "user_voices" ("mezon_user_id", "voice_name") `);
    }

}
