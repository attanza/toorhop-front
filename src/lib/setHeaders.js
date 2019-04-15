import jwt from 'jsonwebtoken'
import moment from 'moment'
import getVars from './GetVars'
async function setHeader () {
  const now = moment().utc()

  const token = await jwt.sign(
    {
      exp: now.add(5, 'm').unix(),
      data: {
        date: now.unix(),
        client_key: getVars.toorhopClientKey()
      }
    },
    getVars.toorhoopClientSecret()
  )

  return {
    'x-toorhop-date': now.unix(),
    'x-toorhop-key': getVars.toorhopClientKey(),
    'x-toorhop-token': token
  }
}

export default setHeader
