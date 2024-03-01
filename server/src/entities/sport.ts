import { validates } from '@server/utils/validation'
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { z } from 'zod'
import { Session } from './session'
import { Timeslot } from './timeslot'

@Entity()
export class Sport {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text')
  name: string

  @OneToMany(() => Session, (session) => session.sport)
  sessions: Session[]

  @OneToMany(() => Timeslot, (timeslot) => timeslot.sport)
  timeslots: Timeslot[]
}

export type SportBare = Omit<Sport, 'sessions' | 'timeslots'>

export const sportSchema = validates<SportBare>().with({
  id: z.number().int().positive(),
  name: z.string().min(1).max(64).trim(),
})

export const sportInsertSchema = sportSchema.omit({
  id: true,
})

export type SportInsert = z.infer<typeof sportInsertSchema>
