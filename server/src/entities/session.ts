import { validates } from '@server/utils/validation'
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { z } from 'zod'
import { Sport } from './sport'
import { User } from './user'
import { Trainer } from './trainer'

@Entity()
export class Session {
  @BeforeInsert()
  calculateSpotsLeft() {
    if (!this.users) {
      this.spotsLeft = this.spotsTotal
    } else {
      this.spotsLeft = this.spotsTotal - this.users.length
    }
  }

  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('integer')
  sportId: number

  @ManyToOne(() => Sport, (sport) => sport.sessions, {
    eager: true,
  })
  @JoinColumn({ name: 'sport_id' })
  sport: Sport

  @Column('integer')
  trainerId: number

  @ManyToOne(() => Trainer, (trainer) => trainer.sessions, {
    eager: true,
  })
  @JoinColumn({ name: 'trainer_id' })
  trainer: Trainer

  @Column('date')
  date: string

  @Column('time')
  timeStart: string

  @Column('time')
  timeEnd: string

  @ManyToMany(() => User, (user) => user.sessions)
  @JoinTable({
    name: 'session_booking',
  })
  users: User[]

  @Column('integer')
  spotsTotal: number

  @Column({
    type: 'integer',
    default: null,
  })
  spotsLeft: number

  @Column({ type: 'boolean', default: false })
  isCancelled: boolean
}

export type SessionBare = Omit<
  Session,
  'sport' | 'trainer' | 'users' | 'spotsLeft' | 'calculateSpotsLeft'
>

export const sessionSchema = validates<SessionBare>().with({
  id: z.number().int().positive(),
  sportId: z.number().int().positive(),
  trainerId: z.number().int().positive(),
  date: z.string(),
  timeStart: z.string(),
  timeEnd: z.string(),
  spotsTotal: z.number().int().positive(),
  isCancelled: z.boolean(),
})

export const sessionInsertSchema = sessionSchema.omit({
  id: true,
  isCancelled: true,
  spotsLeft: true,
})

export type SessionInsert = z.infer<typeof sessionInsertSchema>
