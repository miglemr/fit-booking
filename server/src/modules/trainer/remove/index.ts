import { Trainer } from '@server/entities'
import { trainerSchema } from '@server/entities/trainer'
import { adminProcedure } from '@server/trpc/adminProcedure'

export default adminProcedure
  .input(trainerSchema.pick({ id: true }))
  .mutation(async ({ input: { id }, ctx: { db } }) => {
    await db.getRepository(Trainer).delete(id)
  })
