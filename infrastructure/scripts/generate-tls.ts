#!/usr/bin/env ts-node

const path = require('path');
const { exec } = require('./openssl');
const { ipRegex } = require('./ipRegex');

const args = require('yargs')
  .env('AVA')
  .options({
    passphrase: {
      alias: 'p',
      help: 'passphrase',
      default: 'veryinsecure',
    },
    days: {
      help: 'days',
      default: 3650,
    },
    dns: {
      help: 'DNS name or IP',
      multiple: true,
      default: [
        '127.0.0.1',
        'docker-registry.docker-registry.svc.cluster.local',
      ],
    },
    commonName: {
      alias: 'n',
      default: `docker-registry.docker-registry.svc.cluster.local`,
    },
    countryName: {
      alias: 'c',
      default: 'IM',
    },
    localityName: {
      alias: 'l',
      default: 'CITY',
    },
    stateOrProvinceName: {
      alias: 's',
      default: 'CITY',
    },
    organizationName: {
      alias: 'o',
      default: 'docker-registry.docker-registry.svc.cluster.local',
    },
    organizationalUnitName: {
      default: 'C',
    },
    emailAddress: {
      default: 'me@ari.io',
      help: 'email address',
    },
    outDir: {
      default: path.join(__dirname, '..', 'config'),
      help: 'directory to save the certs',
    },
  })
  .help(`Generate self-signed certificates`)
  .alias('help', 'h').argv;

console.log(`Generating certs`);
const attrs = [
  {
    name: 'CN',
    value: args.commonName,
  },
  { name: 'C', value: args.countryName },
  { name: 'L', value: args.localityName },
  { name: 'ST', value: args.stateOrProvinceName },
  { name: 'O', value: args.organizationName },
  { name: 'OU', value: args.organizationalUnitName },
  // { name: "emailAddress", value: args.emailAddress },
];

const subj = attrs
  .reduce((acc: string[], { name, value }: { name: string; value: string }) => {
    acc.push(`/${name}=${value}`);
    return acc;
  }, [])
  .join('');

// @ts-ignore
const addext = args.dns
  .reduce((acc: string[], domain: string) => {
    const isIp = ipRegex({ exact: true }).test(domain);
    if (isIp) {
      acc.push(`IP:${domain}`);
    } else {
      acc.push(`DNS:${domain}`);
    }
    return acc;
  }, [])
  .join(',');

const outDir = path.normalize(args.outDir);

const keyFile = path.join(outDir, 'tls.key');
const certFile = path.join(outDir, `tls.crt`);
// const csrFile = path.join(outDir, `tls.csr`);
// const privKey = path.join(outDir, "tls.priv");
// const pemFile = path.join(outDir, "tls.pem");
// const certPem = path.join(outDir, "ca_cert.pem");
// const certReq = path.join(outDir, "cert_req.csr");
(async () => {
  // console.log(`Generate certificate authority files`);
  // await exec("genrsa", { out: certPem, "4096": false });
  console.log(`Generating certificate`);
  // openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes \
  // -keyout example.key -out example.crt -subj "/CN=example.com" \
  // -addext "subjectAltName=DNS:example.com,DNS:www.example.net,IP:10.0.0.1"
  await exec('req', {
    x509: true,
    newkey: 'rsa:4096',
    sha256: true,
    days: args.days,
    nodes: true,
    keyout: keyFile,
    out: certFile,
    // passin: `pass:'${args.passphrase}'`,
    subj: `${subj}`,
    // addext: `"subjectAltName=${addext}"`,
  });
  console.log(`Checking keys`);
  const val1 = (await exec('pkey', {
    pubout: true,
    in: keyFile,
  })) as Buffer;
  const val2 = (await exec('x509', {
    pubkey: true,
    in: certFile,
    noout: true,
  })) as Buffer;
  const b1 = await exec(`sha256`, {}, val1.toString());
  const b2 = await exec('sha256', {}, val2.toString());
  console.log('val1', b1.toString());
  console.log('val2', b2.toString());
  // // openssl req -new -key my_private_key.pem -out my_cert_req.pem
  // await exec("req", {
  //   new: true,
  //   nodes: true,
  //   sha256: true,
  //   subj: subj,
  //   newkey: "rsa:4096",
  //   key: pemFile,
  //   out: certReq,
  //   passin: `pass:'${args.passphrase}'`,
  // });
  // console.log(`Generating self-signed certificate`);
  // // openssl x509 -req -in my_cert_req.pem -days 365 -CA ca_cert.pem -CAkey ca_private_key.pem -CAcreateserial -out my_signed_cert.pem
  // await exec("x509", {
  //   in: certReq,
  //   out: certFile,
  //   CA: certPem,
  //   CAkey: pemFile,
  //   CAcreateserial: true,
  //   days: args.days,
  //   // passin: `pass:${args.passphrase}`,
  // });
  console.log(`Generated pems, saving to ${outDir}`);
})();

// fs.writeFileSync(certFile, pems.cert, "utf-8");
// fs.writeFileSync(keyFile, pems.public, "utf-8");
// fs.writeFileSync(privKey, pems.private, "utf-8");
