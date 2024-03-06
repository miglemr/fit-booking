import { Session, Trainer, Sport } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import {
  fakeSession,
  fakeSport,
  fakeTrainer,
} from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import sessionRouter from '../..'

const db = await createTestDatabase()
const sessionRepository = db.getRepository(Session)

const createCaller = createCallerFactory(sessionRouter)

const { findByDate } = createCaller(authContext({ db }))

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])

it('should find all sessions for specified date and list them in asceding order by start time', async () => {
  const session = fakeSession({
    sportId: 1,
    trainerId: 1,
    date: '2024-03-22',
    timeStart: '10:00',
    timeEnd: '11:00',
  })
  const sessionTwo = fakeSession({
    sportId: 1,
    trainerId: 1,
    date: '2024-03-22',
    timeStart: '14:00',
    timeEnd: '15:00',
  })
  const sessionThree = fakeSession({
    sportId: 1,
    trainerId: 1,
    date: '2024-03-25',
    timeStart: '12:00',
    timeEnd: '13:00',
  })
  const sessionFour = fakeSession({
    sportId: 1,
    trainerId: 1,
    date: '2024-03-22',
    timeStart: '9:00',
    timeEnd: '10:00',
  })
  await sessionRepository.save([session, sessionTwo, sessionThree, sessionFour])

  const response = await findByDate({ date: '2024-03-22' })

  expect(response).toHaveLength(3)
  expect(response[0].timeStart).toEqual('09:00:00')
  expect(response[1].timeStart).toEqual('10:00:00')
  expect(response[2].timeStart).toEqual('14:00:00')
  expect(response[0]).toHaveProperty('sport')
  expect(response[0]).toHaveProperty('trainer')
})
