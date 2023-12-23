import { Strapi } from "@strapi/strapi";
import axios, { AxiosError } from "axios";
import { errors } from "@strapi/utils";
import access from "../utils/access";

const trim = (value: string) => {
  const pattern = /[^0-9]/g;
  return value.replace(pattern, "");
};

export default ({ strapi }: { strapi: Strapi }) => ({
  register: async (ctx) => {
    try {
      const header = ctx.request.header;
      const names = {
        apiKey: "x-api-key",
        apiSecret: "x-api-secret",
      };

      const token = await access.get(header[names.apiKey]);

      if (!token) {
        throw new errors.ApplicationError("Not found ApiKey");
      }

      if (token !== header[names.apiSecret]) {
        throw new errors.UnauthorizedError("Token is invalid");
      }

      const { phoneAreaCode, phoneNumber, ...params } = ctx.request.body;
      const domain = ctx.protocol + "://" + ctx.request.host;
      const req = await axios.post(domain + "/api/auth/local/register", params);
      const res = await req.data;

      let userPhone;
      if (res.user.id) {
        const userId = res.user.id;
        userPhone = await strapi.entityService?.create(
          "plugin::strapi-netgsm.user-phone",
          {
            data: {
              phoneAreaCode: trim(phoneAreaCode),
              phoneNumber: trim(phoneNumber),
              user: userId,
            },
          }
        );
      }

      await access.del(header[names.apiKey]);

      ctx.body = { userPhone, ...res };
    } catch (error) {
      if (error instanceof AxiosError) {
        ctx.status = error.response?.status;
        ctx.body = error.response?.data;
      } else {
        throw new errors.ApplicationError(error.message);
      }
    }
  },
});
