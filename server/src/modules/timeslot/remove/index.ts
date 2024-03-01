import { Timeslot } from '@server/entities'
import { timeslotSchema } from '@server/entities/timeslot'
import { adminProcedure } from '@server/trpc/adminProcedure'

export default adminProcedure
  .input(timeslotSchema.pick({ id: true }))
  .mutation(async ({ input: { id }, ctx: { db } }) =>
    db.getRepository(Timeslot).delete(id)
  )
