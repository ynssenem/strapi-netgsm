export default {
  type: "content-api",
  routes: [
    {
      method: "POST",
      path: "/otp/createPhoneVerification",
      handler: "otp.createPhoneVerification",
    },
    {
      method: "POST",
      path: "/otp/phoneVerification",
      handler: "otp.phoneVerification",
    },
    {
      method: "POST",
      path: "/auth/register",
      handler: "auth.register",
      config: {
        middlewares: ["plugin::users-permissions.rateLimit"],
      },
    },
  ],
};
