import { Session, Timeslot } from '@server/entities'
import { timeslotSchema } from '@server/entities/timeslot'
import { adminProcedure } from '@server/trpc/adminProcedure'

export default adminProcedure
  .input(timeslotSchema.pick({ id: true }))
  .mutation(async ({ input: { id }, ctx: { db } }) => {
    const currentDate = new Date().toISOString().substring(0, 10)

    await db.getRepository(Timeslot).delete(id)

    await db
      .getRepository(Session)
      .createQueryBuilder('session')
      .delete()
      .from(Session)
      .where('session.date > :currentDate', { currentDate })
      .execute()
  })
