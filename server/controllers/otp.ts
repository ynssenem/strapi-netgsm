import validations from "../utils/validations"
import code from "../utils/code"
import access from "../utils/access"
import { errors } from "@strapi/utils"
import Netgsm from "@ynssenem/netgsm"

type PhoneProps = {
  phoneAreaCode: string
  phoneNumber: string
}

type CreatePhoneVerificationBodyProps = PhoneProps & {
  message: string
}

type PhoneVerificationBodyProps = PhoneProps & {
  code: string
}

const trim = (value: string) => {
  const pattern = /[^0-9]/g
  return value.replace(pattern, "")
}

export default ({ strapi }) => ({
  createPhoneVerification: async (ctx) => {
    const params = ctx.request.body as CreatePhoneVerificationBodyProps

    await validations.validateCreatePhoneVerificationBody(params)

    const phoneAreaCode = trim(params.phoneAreaCode)
    const phoneNumber = trim(params.phoneNumber)
    const generate = code.generate(6)
    const expire = parseInt(process.env.VERIFY_EXPIRE ?? "120")

    const set = await code.set(phoneAreaCode + phoneNumber, generate, expire)

    try {
      const api = new Netgsm({
        username: process.env.NETGSM_USERNAME,
        password: process.env.NETGSM_PASSWORD,
        msgheader: process.env.NETGSM_MSGHEADER,
      })

      const req = await api.otp(
        phoneAreaCode + phoneNumber,
        params.message.replace("{code}", generate.toString())
      )

      ctx.body = {
        phoneAreaCode,
        phoneNumber,
        set,
      }
    } catch (error) {
      throw new errors.ApplicationError(error.message)
    }
  },

  phoneVerification: async (ctx) => {
    const params = ctx.request.body as PhoneVerificationBodyProps

    await validations.validatePhoneVerificationBody(params)

    const phoneAreaCode = trim(params.phoneAreaCode)
    const phoneNumber = trim(params.phoneNumber)

    const get = await code.get(phoneAreaCode + phoneNumber)

    if (!get) {
      throw new errors.NotFoundError("Not found code")
    }

    if (get !== params.code) {
      throw new errors.UnauthorizedError("The code is not correct")
    }

    const findUsers = await strapi.entityService.findMany("plugin::strapi-netgsm.user-phone", {
      filters: {
        phoneAreaCode,
        phoneNumber,
      },
      populate: {
        user: true,
      },
    })

    let jwt: string | undefined = undefined
    let user: Record<any, any> | undefined = undefined
    let accessKeys

    if (findUsers?.length) {
      user = findUsers[0]
    } else {
      accessKeys = await access.generateHash()
    }

    if (user) {
      jwt = strapi.plugin("users-permissions").service("jwt").issue({ id: user.user.id })
    }

    await code.del(params.code)

    try {
      ctx.body = jwt
        ? {
            jwt: jwt,
            user: user,
          }
        : accessKeys
    } catch (error) {
      throw new errors.ApplicationError(error.message)
    }
  },
})
