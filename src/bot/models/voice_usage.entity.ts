import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, AfterRemove, JoinColumn, ManyToOne, Index } from 'typeorm';
import { UserVoice } from './user_voice.entity';

@Index([
    'mezonClanId',
    'mezonChannelId',
])

@Entity("voice_usage")
export class VoiceUsage {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "text", name: "mezon_clan_id" })
    mezonClanId: string

    @Column({ type: "text", name: "mezon_channel_id" })
    mezonChannelId: string

    @Column({ type: "bigint", name: "created_at" })
    createdAt: number

    @Column({ type: "bigint", nullable: true, name: "updated_at" })
    updatedAt: number

    @ManyToOne(() => UserVoice, (userVoice) => userVoice.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_voice_id" })
    userVoice: UserVoice

    @BeforeInsert()
    setCreatedAt() {
        this.createdAt = Date.now()
    }
    @BeforeUpdate()
    setUpdatedAt() {
        this.updatedAt = Date.now()
    }
}