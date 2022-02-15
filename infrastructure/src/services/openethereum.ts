import { Protocols } from '@dpu/jkcfg-k8s/service';
import * as k8s from '@jkcfg/kubernetes/api';
import { Container, svcPort } from '@dpu/jkcfg-k8s';
import { merge } from 'lodash-es';

// import { PVC } from '@dpu/jkcfg-k8s';
import { finalize } from '@dpu/jkcfg-k8s/util';
import { appNameSelector } from '@dpu/jkcfg-k8s/labels';
import { Deployment } from '@dpu/jkcfg-k8s/deployment';
import { VolumeTypes } from '@dpu/jkcfg-k8s/models';
import { ConfigMap, Ingress } from '../helpers';
// import { hostname } from '../constants';

export async function OpenEthereum() {
  const name = 'openethereum';
  const namespace = name;
  const selector = appNameSelector(name);
  const rootDir = '/home/openethereum/.local/share/openethereum';

  const fileConfigMap = await ConfigMap('openethereum-config-map', {
    namespace,
    files: ['config/config.toml', 'config/arbitrum.json'],
  });

  // const volume = PersistentVolume(name, { namespace });

  // const pvc = PVC(name, {
  //   storageClass: 'nfs',
  //   size: '200Gi',
  //   accessMode: 'ReadWriteOnce',
  // });

  const service = new k8s.core.v1.Service(name, {
    spec: {
      ports: [
        svcPort(30303, {
          protocol: Protocols.TCP,
          name: `eth-tcp`,
          targetPort: 30303,
        }),
        svcPort(30303, {
          protocol: Protocols.UDP,
          name: `eth-udp`,
          targetPort: 30303,
        }),
        svcPort(8545, {
          protocol: Protocols.TCP,
          name: `eth-rpc`,
          targetPort: 8545,
        }),
        svcPort(8546, {
          protocol: Protocols.TCP,
          name: `eth-ws`,
          targetPort: 8546,
        }),
      ],
    },
  });

  const { deployment, addContainer, addVolume } = Deployment(name, {
    labels: selector,
    replicas: 1,
  });
  deployment.spec!.template!.spec!.securityContext = {
    runAsUser: 1000,
    fsGroup: 1000,
  };
  addVolume('openethereum-config-map', VolumeTypes.configMap);
  // addVolume(name);

  addContainer(
    merge(
      Container({
        name,
        image: 'openethereum/openethereum:v3.3.2',
        // pvcs: [
        //   {
        //     name,
        //     mountPath: '/openethereum/data',
        //   },
        // ],
        args: [
          // `--base-path=${rootDir}`,
          `--config=${rootDir}/config/config.toml`,
        ],
      }),
      {
        ports: [
          { containerPort: 30303, protocol: 'UDP' },
          { containerPort: 30303, protocol: 'TCP' },
          { containerPort: 8545, protocol: 'TCP' },
          { containerPort: 8546, protocol: 'TCP' },
        ],
        volumeMounts: [
          {
            name: 'openethereum-config-map',
            mountPath: `${rootDir}/config`,
          },
          {
            name: `openethereum-log-dir`,
            mountPath: `${rootDir}/log`,
          },
          {
            name,
            mountPath: `${rootDir}/data`,
          },
        ],
      }
    )
  );

  [
    { name: 'openethereum-log-dir', emptyDir: {} },
    { name: name, emptyDir: {} },
    // { name, persistentVolumeClaim: { claimName: 'nfs' } },
  ].forEach((obj) => deployment.spec!.template!.spec!.volumes!.push(obj));

  const backend = {
    paths: [
      {
        path: '/',
        pathType: 'Prefix',
        backend: {
          service: {
            name,
            port: { number: 8545 },
          },
        },
      },
    ],
  };
  const ingress = Ingress(name, {
    namespace,
    hosts: {
      localhost: backend,
    },
  });

  // , volume, pvc
  return finalize([fileConfigMap, deployment, service, ingress], {
    labels: selector,
    namespace,
  });
}

export default OpenEthereum;
