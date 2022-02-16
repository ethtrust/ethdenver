// import { readFile } from '../utils';
import { finalize } from '@dpu/jkcfg-k8s';
// import * as Buffer from 'Buffer';

export const DockerRegistry = async () => {
  const name = 'docker-registry';
  const namespace = name;

  // const buf = await readFile('config/docker-config.json');
  // const val = Buffer.from(buf).toString('base64');
  const val =
    'ew0KICAiYXV0aHMiOiB7DQogICAgImxvY2FsaG9zdDo1MDAwIjoge30NCiAgfQ0KfQ0K';
  const secret = {
    apiVersion: 'v1',
    kind: 'Secret',
    type: 'kubernetes.io/dockerconfigjson',
    metadata: {
      name,
      namespace,
    },
    data: {
      '.dockerconfigjson': val,
    },
  };

  const deploy = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: { name, namespace },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: name,
        },
      },
      template: {
        metadata: {
          labels: {
            app: name,
            name,
          },
        },
        spec: {
          containers: [
            {
              name: 'registry',
              image: 'registry:2',
              ports: [{ containerPort: 5000 }],
            },
          ],
        },
      },
    },
  };

  const svc = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name,
      namespace,
    },
    spec: {
      selector: {
        app: name,
      },
      type: 'LoadBalancer',
      ports: [
        {
          name: 'docker-port',
          protocol: 'TCP',
          port: 5000,
          targetPort: 5000,
        },
      ],
      loadBalancerIP: '192.168.0.232',
    },
  };

  return finalize([deploy, svc, secret], {
    labels: { app: name },
    namespace,
  });
};

export default DockerRegistry;
