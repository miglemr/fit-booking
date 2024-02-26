import { Timeslot } from '@server/entities'
import { timeslotInsertSchema } from '@server/entities/timeslot'
import { adminProcedure } from '@server/trpc/adminProcedure'
import { checkTimeslotOverlap } from './service'

export default adminProcedure
  .input(timeslotInsertSchema)
  .mutation(async ({ input, ctx: { db } }) => {
    await checkTimeslotOverlap(input, db)

    const timeslot = await db.getRepository(Timeslot).save(input)

    return timeslot
  })
