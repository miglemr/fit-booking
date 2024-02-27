import bcrypt from 'bcrypt'
import { publicProcedure } from '@server/trpc'
import { User } from '@server/entities'
import config from '@server/config'
import { userInsertSchema } from '@server/entities/user'
import { TRPCError } from '@trpc/server'

export default publicProcedure
  .input(userInsertSchema)
  .mutation(async ({ input: { email, password, firstName }, ctx: { db } }) => {
    const hash = await bcrypt.hash(password, config.auth.passwordCost)

    try {
      const user = await db.getRepository(User).save({
        email,
        password: hash,
        firstName,
      })

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
      }
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error
      }

      if (error.message.includes('duplicate key')) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User with this email already exists',
        })
      }

      throw error
    }
  })
