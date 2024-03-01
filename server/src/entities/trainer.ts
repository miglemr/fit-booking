import { validates } from '@server/utils/validation'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { z } from 'zod'
import { Session } from './session'
import { Timeslot } from './timeslot'

@Entity()
export class Trainer {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text')
  firstName: string

  @Column('text')
  lastName: string

  @OneToMany(() => Session, (session) => session.trainer)
  sessions: Session[]

  @OneToMany(() => Timeslot, (timeslot) => timeslot.trainer)
  timeslots: Timeslot[]
}

export type TrainerBare = Omit<Trainer, 'sessions' | 'timeslots'>

export const trainerSchema = validates<TrainerBare>().with({
  id: z.number().int().positive(),
  firstName: z.string().min(1).max(64),
  lastName: z.string().min(1).max(64),
})

export const trainerInsertSchema = trainerSchema.omit({
  id: true,
})

export type TrainerInsert = z.infer<typeof trainerInsertSchema>
