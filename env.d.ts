declare namespace NodeJS {
  export interface ProcessEnv {
    readonly VERIFY_EXPIRE: string;
    readonly NETGSM_USERNAME: string;
    readonly NETGSM_PASSWORD: string;
    readonly NETGSM_MSGHEADER: string;
  }
}
