import jwt from 'jsonwebtoken'
import moment from 'moment'
import getVars from './GetVars'
async function setHeader () {
  const date = moment().unix()
  const token = await jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 2 * 60,
      data: {
        date,
        client_key: getVars.toorhopClientKey()
      }
    },
    getVars.toorhoopClientSecret()
  )

  return {
    'x-toorhop-date': date,
    'x-toorhop-key': getVars.toorhopClientKey(),
    'x-toorhop-token': token
  }
}

export default setHeader
