# Strapi plugin strapi-netgsm

## Config/Plugins.ts

```ts
export default {
  "strapi-netgsm": {
    enabled: true,
    resolve: "./src/plugins/strapi-netgsm",
  },
};
```

## ENV File

```env
# Redis
REDIS_PREFIX=strapi-netgsm
REDIS_HOST=0.0.0.0
REDIS_PORT=6379
REDIS_PASSWORD=1234

# Strapi Netgsm
VERIFY_EXPIRE=120
NETGSM_USERNAME=tobemodified
NETGSM_PASSWORD=tobemodified
NETGSM_MSGHEADER=tobemodified
```

A quick description of strapi-netgsm.
