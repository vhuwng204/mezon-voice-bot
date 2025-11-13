import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1763022450315 implements MigrationInterface {
    name = 'InitDatabase1763022450315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_voices" ("id" SERIAL NOT NULL, "mezon_user_id" text NOT NULL, "voice_path" text NOT NULL, "voice_name" text NOT NULL, "is_default" boolean NOT NULL DEFAULT false, "is_private" "public"."user_voices_is_private_enum" NOT NULL DEFAULT 'private', "number_usage" bigint NOT NULL DEFAULT '1', "created_by" text NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint, CONSTRAINT "PK_af8c2111ddce5a7644d2cb8501c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_81f2716f3edca10f72c57b6ab5" ON "user_voices" ("mezon_user_id", "voice_name", "number_usage", "is_default", "voice_path", "is_private") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_81f2716f3edca10f72c57b6ab5"`);
        await queryRunner.query(`DROP TABLE "user_voices"`);
    }

}
