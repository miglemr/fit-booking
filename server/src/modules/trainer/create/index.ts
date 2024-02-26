import { Trainer } from '@server/entities'
import { trainerInsertSchema } from '@server/entities/trainer'
import { adminProcedure } from '@server/trpc/adminProcedure'

export default adminProcedure
  .input(trainerInsertSchema)
  .mutation(async ({ input, ctx: { db } }) => {
    const trainer = await db.getRepository(Trainer).save(input)

    return trainer
  })
