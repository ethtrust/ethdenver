import { VolumeTypes } from '@dpu/jkcfg-k8s/models';
import { Deployment } from '@dpu/jkcfg-k8s/deployment';
import * as k8s from '@jkcfg/kubernetes/api';
import { Container, svcPort } from '@dpu/jkcfg-k8s';
import { appNameSelector } from '@dpu/jkcfg-k8s/labels';
import { merge } from 'lodash-es';
import { Ingress } from '../helpers';
import { finalize } from '@dpu/jkcfg-k8s/util';
import { letsencrypt, hostname } from '../constants';

export async function POEEventEmitterApi() {
  const name = 'poe-event-emitter';
  const namespace = name;
  const selector = appNameSelector(name);
  const port = 8000;

  const service = new k8s.core.v1.Service(name, {
    spec: {
      ports: [svcPort(port)],
      selector,
    },
  });

  const backend = {
    paths: [
      {
        path: '/',
        pathType: 'Prefix',
        backend: {
          service: {
            name,
            port: { number: port },
          },
        },
      },
    ],
  };

  const ingress = Ingress(name, {
    namespace,
    annotations: letsencrypt.issuers.prod.annotations,
    hosts: {
      [hostname.netgearApi]: backend,
    },
  });

  const { deployment, addContainer, addVolume } = Deployment(name, {
    labels: selector,
  });
  addVolume(name, VolumeTypes.configMap);
  addContainer(
    merge(
      Container({
        name,
        port,
        image: 'localhost:5000/auser/event-emitter',
      }),
      {
        env: [
          {
            name: 'PORT',
            value: `${port}`,
          },
        ],
      }
    )
  );

  return finalize([service, ingress, deployment], {
    labels: selector,
    namespace,
  });
}

export default POEEventEmitterApi;
