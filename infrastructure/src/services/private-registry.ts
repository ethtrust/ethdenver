import { finalize } from '@dpu/jkcfg-k8s';

export const DockerRegistry = () => {
  const name = 'registry';
  const namespace = 'docker-registry';

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
      name: `${name}-service`,
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

  return finalize([deploy, svc], {
    labels: { app: name },
    namespace,
  });
};

export default DockerRegistry;
