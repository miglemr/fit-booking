import { Session, Timeslot } from '@server/entities'
import { adminProcedure } from '@server/trpc/adminProcedure'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export default adminProcedure
  .input(
    z.object({
      date: z.date(),
    })
  )
  .mutation(async ({ input: { date }, ctx: { db } }) => {
    const day = date.getDay()

    const timeslots = await db.getRepository(Timeslot).find({
      where: {
        dayOfWeek: day,
      },
    })

    if (timeslots.length === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No timeslots found for this day',
      })
    }

    const timeslotsInsert = timeslots.map((timeslot) => {
      const { dayOfWeek, ...rest } = timeslot

      Object.assign(rest, {
        date,
        timeslotId: timeslot.id,
      })

      return rest
    }) as Session[]

    const records = db.getRepository(Session).create(timeslotsInsert)
    const sessions = await db.getRepository(Session).save(records)

    return sessions
  })
