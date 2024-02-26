import { Trainer, Sport, Session, User } from '@server/entities'
import { createTestDatabase } from '@tests/utils/database'
import {
  fakeSport,
  fakeTrainer,
  fakeSession,
  fakeUser,
} from '@server/entities/tests/fakes'
import { checkBookingOverlap } from './service'

const db = await createTestDatabase()

const user = fakeUser()
await db.getRepository(User).save(user)

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])
await db.getRepository(Session).save([
  fakeSession({
    sportId: 1,
    trainerId: 1,
    date: '2024-02-25',
    timeStart: '10:00',
    timeEnd: '11:00',
    users: [user],
  }),
])

it('should throw an error if there is a booked session that starts and ends at the same time', async () => {
  const session = fakeSession({
    sportId: 2,
    trainerId: 2,
    date: '2024-02-25',
    timeStart: '10:00',
    timeEnd: '11:00',
  }) as Session

  await expect(checkBookingOverlap(user, session, db)).rejects.toThrow(
    /overlaps/
  )
})

it('should throw an error if booked session starts in between other booked session', async () => {
  const session = fakeSession({
    sportId: 2,
    trainerId: 2,
    date: '2024-02-25',
    timeStart: '10:30',
    timeEnd: '11:30',
  }) as Session

  await expect(checkBookingOverlap(user, session, db)).rejects.toThrow(
    /overlaps/
  )
})

it('should not throw an error if there is no overlapping booking', async () => {
  const session = fakeSession({
    sportId: 2,
    trainerId: 2,
    date: '2024-02-25',
    timeStart: '12:30',
    timeEnd: '13:30',
  }) as Session

  await expect(checkBookingOverlap(user, session, db)).resolves.not.toThrow()
})

it('should not throw an error if there is a booking at the same time but different date', async () => {
  const session = fakeSession({
    sportId: 1,
    trainerId: 1,
    date: '2024-02-26',
    timeStart: '10:00',
    timeEnd: '11:00',
  }) as Session

  await expect(checkBookingOverlap(user, session, db)).resolves.not.toThrow()
})
