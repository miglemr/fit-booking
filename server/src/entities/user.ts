import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { z } from 'zod'
import { Session } from './session'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Unique(['email'])
  @Column('text')
  email: string

  @Column('text', { select: false })
  password: string

  @Column('text')
  firstName: string

  @ManyToMany(() => Session, (session) => session.users)
  sessions: Session[]

  @Column({
    type: 'boolean',
    default: false,
  })
  isAdmin: boolean
}

export type UserBare = Omit<User, 'sessions' | 'isAdmin'>

export const userSchema = validates<UserBare>().with({
  id: z.number().int().positive(),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(64),
  firstName: z.string().min(1).max(64).trim(),
})

export const userInsertSchema = userSchema.omit({
  id: true,
})

export type UserInsert = z.infer<typeof userInsertSchema>

export type AuthUser = Pick<User, 'id' | 'isAdmin'>

export const authUserSchema = validates<AuthUser>().with({
  id: z.number().int().positive(),
  isAdmin: z.boolean(),
})
