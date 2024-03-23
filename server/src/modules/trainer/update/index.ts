import { Trainer, trainerSchema } from '@server/entities/trainer'
import { adminProcedure } from '@server/trpc/adminProcedure'

export default adminProcedure
  .input(
    trainerSchema.partial({
      firstName: true,
      lastName: true,
    })
  )
  .mutation(async ({ input, ctx: { db } }) => {
    const { id, ...rest } = input
    await db.getRepository(Trainer).update(id, rest)
  })
