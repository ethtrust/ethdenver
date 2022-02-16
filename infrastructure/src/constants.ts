export const letsencrypt = {
  issuers: {
    staging: {
      name: `letsencrypt-staging`,
    },
    prod: {
      name: `letsencrypt-prod`,
      annotations: {},
    },
  },
  email: 'me@ari.io',
};

export const hostname = {
  mobileApp: `tinybyte.co`,
  chain: `chain.tinybyte.co`,
  netgearApi: `api.tinybyte.co`,
  dockerRegistry: 'docker.tinybyte.co',
};
