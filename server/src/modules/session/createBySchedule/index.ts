import { z } from 'zod'
import { Session, Timeslot } from '@server/entities'
import { adminProcedure } from '@server/trpc/adminProcedure'
import { isSessionOverlap } from './service'

export default adminProcedure
  .input(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
    })
  )
  .mutation(async ({ input: { startDate, endDate }, ctx: { db } }) => {
    const dates = getDateArray(startDate, endDate)

    function getDateArray(start: Date, end: Date) {
      const dateArray = []

      let current = start

      function addDay(date: Date) {
        date.setDate(date.getDate() + 1)
        return date
      }

      while (current <= end) {
        dateArray.push(new Date(current))
        current = addDay(current)
      }

      return dateArray
    }

    await Promise.all(dates.map((date) => createSessions(date)))

    async function createSessions(date: Date) {
      const day = date.getDay()

      const timeslots = await db.getRepository(Timeslot).find({
        where: {
          dayOfWeek: day,
        },
      })

      if (timeslots.length === 0) return

      const timeslotsInsert = timeslots.map((timeslot) => {
        const { dayOfWeek, ...rest } = timeslot

        Object.assign(rest, {
          date,
          timeslotId: timeslot.id,
        })

        return rest
      }) as Session[]

      await Promise.all(
        timeslotsInsert.map(async (timeslot) => {
          const isOverlap = await isSessionOverlap(timeslot, db)

          if (isOverlap) {
            return
          }

          const records = db.getRepository(Session).create(timeslot)
          await db.getRepository(Session).save(records)
        })
      )
    }
  })
