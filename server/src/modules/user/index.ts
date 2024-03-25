import { router } from '@server/trpc'
import login from './login'
import signup from './signup'
import makeAdmin from './makeAdmin'

export default router({
  login,
  signup,
  makeAdmin,
})
