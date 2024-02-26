import { Trainer } from '@server/entities'
import { adminProcedure } from '@server/trpc/adminProcedure'

export default adminProcedure.query(async ({ ctx: { db } }) => {
  const trainers = await db.getRepository(Trainer).find()

  return trainers
})
