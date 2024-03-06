import { Session, Trainer, Sport } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import {
  fakeAdmin,
  fakeSession,
  fakeSport,
  fakeTrainer,
} from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import sessionRouter from '../../index'

const db = await createTestDatabase()
const sessionRepository = db.getRepository(Session)

const createCaller = createCallerFactory(sessionRouter)

const { createCustom } = createCaller(authContext({ db }, fakeAdmin()))

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])

it('should save a session', async () => {
  const session = fakeSession({ sportId: 1, trainerId: 1 })

  const response = await createCustom(session)

  expect(response).toEqual({
    ...session,
    id: expect.any(Number),
    date: expect.stringContaining('2024'),
    timeStart: expect.stringContaining(':00'),
    timeEnd: expect.stringContaining(':00'),
    isCancelled: false,
    spotsTotal: 10,
    spotsLeft: 10,
  })
  const sessionsFound = await sessionRepository.find()
  expect(sessionsFound).toEqual([
    {
      ...session,
      id: expect.any(Number),
      sport: expect.any(Object),
      trainer: expect.any(Object),
      date: expect.stringContaining('2024'),
      timeStart: expect.stringContaining(':00'),
      timeEnd: expect.stringContaining(':00'),
      isCancelled: false,
      spotsTotal: 10,
      spotsLeft: 10,
    },
  ])
})

it('should throw an error if there is an overlapping session', async () => {
  await createCustom(
    fakeSession({
      sportId: 1,
      trainerId: 1,
      date: '2024-02-24',
      timeStart: '10:00',
      timeEnd: '11:00',
    })
  )

  await expect(
    createCustom(
      fakeSession({
        sportId: 1,
        trainerId: 1,
        date: '2024-02-24',
        timeStart: '10:30',
        timeEnd: '11:30',
      })
    )
  ).rejects.toThrow(/overlaps/)
})

it('should throw an error if date is invalid', async () => {
  await expect(
    createCustom(
      fakeSession({
        sportId: 1,
        trainerId: 1,
        date: '2024-13-24',
      })
    )
  ).rejects.toThrow()
})

it('should throw an error if time is invalid', async () => {
  await expect(
    createCustom(
      fakeSession({
        trainerId: 1,
        sportId: 1,
        timeStart: '26:00',
      })
    )
  ).rejects.toThrow()
})

it('should throw an error if referenced sport ID is invalid', async () => {
  await expect(
    createCustom(
      fakeSession({
        trainerId: 111,
        sportId: 1,
      })
    )
  ).rejects.toThrow()
})

it('should throw an error if referenced trainer ID is invalid', async () => {
  await expect(
    createCustom(
      fakeSession({
        trainerId: 1,
        sportId: 111,
      })
    )
  ).rejects.toThrow()
})
