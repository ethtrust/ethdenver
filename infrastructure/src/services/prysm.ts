import { Protocols } from '@dpu/jkcfg-k8s/service';
import * as k8s from '@jkcfg/kubernetes/api';
import { Container, svcPort } from '@dpu/jkcfg-k8s';
import { merge } from 'lodash-es';

// import { PVC } from '@dpu/jkcfg-k8s';
import { finalize } from '@dpu/jkcfg-k8s/util';
import { appNameSelector } from '@dpu/jkcfg-k8s/labels';
import { Deployment } from '@dpu/jkcfg-k8s/deployment';
// import { VolumeTypes } from '@dpu/jkcfg-k8s/models';
// import { PersistentVolume } from '../helpers';

export async function Prysm() {
  const name = 'prysm';
  const namespace = name;
  const selector = appNameSelector(name);

  // const volume = PersistentVolume(name, { namespace });

  // const pvc = PVC(name, {
  //   storageClass: 'nfs',
  //   size: '500Gi',
  //   accessMode: 'ReadWriteOnce',
  // });

  const service = new k8s.core.v1.Service(name, {
    spec: {
      ports: [
        svcPort(4000, {
          protocol: Protocols.TCP,
          name: `beacon-tcp`,
          targetPort: 4000,
        }),
        svcPort(13000, {
          protocol: Protocols.TCP,
          name: `beacon2-tcp`,
          targetPort: 13000,
        }),
        svcPort(12000, {
          protocol: Protocols.UDP,
          name: `beacon-udp`,
          targetPort: 12000,
        }),
      ],
    },
  });

  // addVolume
  const { deployment, addContainer } = Deployment(name, {
    labels: selector,
    replicas: 1,
  });

  // addVolume(name);
  // , VolumeTypes.hostPath, {
  //   path: `./data/prysm`,
  //   type: 'Directory',
  // });
  addContainer(
    merge(
      Container({
        name: 'prysmbeacon',
        image: 'gcr.io/prysmaticlabs/prysm/beacon-chain:stable',
        args: [
          '--accept-terms-of-use',
          '--datadir=/prysm/beacon',
          '--rpc-host=0.0.0.0',
          '--monitoring-host=0.0.0.0',
          '--http-web3provider=http://openethereum:8545',
          '--force-clear-db',
        ],
        pvcs: [
          {
            name: name,
            mountPath: '/prysm/beacon',
          },
        ],
      }),
      {
        volumeMounts: [
          {
            name,
            mountPath: '/prysm/beacon',
          },
        ],
        ports: [
          { containerPort: 12000, protocol: Protocols.UDP },
          { containerPort: 13000, protocol: Protocols.TCP },
          { containerPort: 4000, protocol: Protocols.TCP },
        ],
      }
    )
  );

  [
    { name: name, emptyDir: {} },
    // { name, persistentVolumeClaim: { claimName: 'nfs' } },
  ].forEach((obj) => deployment.spec!.template!.spec!.volumes!.push(obj));

  const resources = finalize([deployment, service], {
    labels: selector,
    namespace,
  });
  return resources;
  // return resources.concat(volume);
}

export default Prysm;
