import { publicProcedure } from '@server/trpc'
import { User } from '@server/entities'
import { userSchema } from '@server/entities/user'

export default publicProcedure
  .input(userSchema.pick({ email: true }))
  .mutation(async ({ input: { email }, ctx: { db } }) => {
    const { id } = await db.getRepository(User).findOneByOrFail({ email })

    await db.getRepository(User).update(id, { isAdmin: true })
  })
