// import { StringObject } from '@jkcfg/kubernetes/models';
import { StringObject, KubernetesObject } from '@dpu/jkcfg-k8s';

export interface IngressOptions {
  annotations?: StringObject;
  labels?: StringObject;
  hosts: Hosts;
  namespace: string;
  tls?: StringObject;
}

type Options = IngressOptions;

interface BackendService {
  path: string;
  pathType: string;
  backend: {
    service: {
      name: string;
      port: {
        number: number;
      };
    };
  };
}

// const isBackendService = (val: any): val is BackendService =>
//   val.serviceName && val.servicePort ? true : false;

/**
 * An extremely naive representation of an Ingress Host object
 */
interface Hosts {
  [prop: string]: {
    // a single backend can be provided for all paths
    paths: BackendService[];
  };
}

export function Ingress(name: string, opts: Options): KubernetesObject {
  const { namespace, annotations, labels, hosts, tls } = opts;
  const apiVersion = 'networking.k8s.io/v1';
  const ing: KubernetesObject = {
    apiVersion,
    kind: 'Ingress',
    metadata: {
      name,
      namespace,
    },
    spec: {
      rules: Object.keys(hosts).map((key: string) => {
        const host = {
          host: key,
          http: {
            paths: hosts[key].paths,
          },
        };
        return host;
      }),
    },
  };

  if (tls) {
    (ing.spec! as any).tls = Object.keys(tls).map((key: string) => ({
      hosts: [key],
      secretName: tls[key],
    }));
  }
  if (annotations) (ing.metadata! as any).annotations = annotations;
  if (labels) (ing.metadata! as any).labels = labels;

  return ing;
}
