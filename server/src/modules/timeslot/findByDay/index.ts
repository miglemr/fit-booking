import { Timeslot } from '@server/entities'
import { timeslotSchema } from '@server/entities/timeslot'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(timeslotSchema.pick({ day_of_week: true }))
  .query(async ({ input: { day_of_week }, ctx: { db } }) => {
    const timeslots = await db.getRepository(Timeslot).find({
      where: { day_of_week },
      order: {
        timeStart: 'ASC',
      },
    })

    return timeslots
  })
