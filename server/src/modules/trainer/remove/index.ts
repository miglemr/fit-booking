import { Trainer, trainerSchema } from '@server/entities/trainer'
import { adminProcedure } from '@server/trpc/adminProcedure'

export default adminProcedure
  .input(trainerSchema.pick({ id: true }))
  .mutation(async ({ input: { id }, ctx: { db } }) =>
    db.getRepository(Trainer).delete(id)
  )
