import { yup, validateYupSchema } from "@strapi/utils";

const createPhoneVerificationSchema = yup.object({
  phoneAreaCode: yup.string().required(),
  phoneNumber: yup.string().required(),
  message: yup
    .string()
    .required("Message is required")
    .test(
      "contains-code",
      "Message must contain {code} parameter",
      (value) => typeof value !== "undefined" && value.includes("{code}")
    ),
});

const phoneVerificationSchema = yup.object({
  phoneAreaCode: yup.string().required(),
  phoneNumber: yup.string().required(),
  code: yup.string().required(),
});

export default {
  validateCreatePhoneVerificationBody: validateYupSchema(
    createPhoneVerificationSchema
  ),
  validatePhoneVerificationBody: validateYupSchema(phoneVerificationSchema),
};
