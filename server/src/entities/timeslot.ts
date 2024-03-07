import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { z } from 'zod'
import { Sport, Trainer, Session } from '.'

@Entity()
export class Timeslot {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('integer')
  dayOfWeek: number

  @Column('integer')
  sportId: number

  @ManyToOne(() => Sport, (sport) => sport.timeslots)
  @JoinColumn({ name: 'sport_id' })
  sport: Sport

  @Column('integer')
  trainerId: number

  @ManyToOne(() => Trainer, (trainer) => trainer.timeslots)
  @JoinColumn({ name: 'trainer_id' })
  trainer: Trainer

  @OneToMany(() => Session, (session) => session.timeslot)
  sessions?: Session[]

  @Column('time')
  timeStart: string

  @Column('time')
  timeEnd: string

  @Column('integer')
  spotsTotal: number
}

export type TimeslotBare = Omit<Timeslot, 'sport' | 'trainer' | 'sessions'>

export const timeslotSchema = validates<TimeslotBare>().with({
  id: z.number().int().positive(),
  dayOfWeek: z.number().nonnegative().lte(6),
  sportId: z.number().int().positive(),
  trainerId: z.number().int().positive(),
  timeStart: z.string(),
  timeEnd: z.string(),
  spotsTotal: z.number().int().positive(),
})

export const timeslotInsertSchema = timeslotSchema.omit({
  id: true,
})

export type TimeslotInsert = z.infer<typeof timeslotInsertSchema>
