import jwt from 'jsonwebtoken'
import moment from 'moment'
import { clientKey, clientSecret } from './toorhopKeys'

async function setHeader () {
  const date = moment().utc()
  const token = await jwt.sign(
    {
      exp: date.add(5, 'm').unix(),
      data: {
        date: date.unix(),
        client_key: clientKey
      }
    },
    clientSecret
  )

  return {
    'x-toorhop-date': date.unix(),
    'x-toorhop-key': clientKey,
    'x-toorhop-token': token
  }
}

export default setHeader
