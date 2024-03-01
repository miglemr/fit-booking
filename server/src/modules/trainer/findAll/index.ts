import { Trainer } from '@server/entities'
import { adminProcedure } from '@server/trpc/adminProcedure'

export default adminProcedure.query(async ({ ctx: { db } }) =>
  db.getRepository(Trainer).find()
)
