import { Timeslot } from '@server/entities'
import { timeslotSchema } from '@server/entities/timeslot'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(timeslotSchema.pick({ dayOfWeek: true }))
  .query(async ({ input: { dayOfWeek }, ctx: { db } }) =>
    db.getRepository(Timeslot).find({
      where: { dayOfWeek },
      order: {
        timeStart: 'ASC',
      },
    })
  )
