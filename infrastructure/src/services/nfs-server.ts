import {
  // appNameSelector,
  // Deployment,
  finalize,
  KubernetesObject,
  // VolumeTypes,
} from '@dpu/jkcfg-k8s';
import { merge } from 'lodash-es';
import { StringObject } from '@dpu/jkcfg-k8s';
import { Image, Name, Namespace, Port } from '@dpu/jkcfg-k8s/parameters';
import { Number, Object, String } from '@jkcfg/std/param';

export interface Parameters {
  name: string;
  namespace: string;
  image: string;
  // clusterIP: string;
  port: number;
  servicePort?: number;
  serviceType: string;
  hostPath: string;
  nodeSelector?: StringObject;
  replicas: number;
  provisioner?: string;
}

export const params: Parameters = {
  name: Name('nfs'),
  namespace: Namespace('nfs'),
  image: Image('k8s.gcr.io/sig-storage/nfs-provisioner:v3.0.0'),
  // clusterIP: String('clusterIP', '10.152.183.217')!,
  port: Port(2049),
  servicePort: Number('servicePort'),
  serviceType: String('serviceType', 'ClusterIP')!,
  hostPath: String('hostPath', '/exports')!,
  nodeSelector: Object('nodeSelector')! as StringObject,
  replicas: Number('replicas', 1)!,
  provisioner: String('provisioner', 'nfs.nfs'),
};

const ClientProvisioner = (p?: Partial<Parameters>): KubernetesObject[] => {
  const { namespace } = merge(params, p);
  const name = 'nfs-client-provisioner';
  // const selector = appNameSelector(name);
  const server = 'nfs.nfs';
  const provisionerName = 'k8s-sigs.io/nfs-subdir-external-provisioner';

  const sa = {
    apiVersion: 'v1',
    kind: 'ServiceAccount',
    metadata: {
      name,
      namespace,
    },
  };

  const clusterRole = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'ClusterRole',
    metadata: {
      name: `${name}-runner`,
    },
    rules: [
      {
        apiGroups: [''],
        resources: ['nodes'],
        verbs: ['get', 'list', 'watch'],
      },
      {
        apiGroups: [''],
        resources: ['persistentvolumes'],
        verbs: ['get', 'list', 'watch', 'create', 'delete'],
      },
      {
        apiGroups: [''],
        resources: ['persistentvolumeclaims'],
        verbs: ['get', 'list', 'watch', 'update'],
      },
      {
        apiGroups: ['storage.k8s.io'],
        resources: ['storageclasses'],
        verbs: ['get', 'list', 'watch'],
      },
      {
        apiGroups: [''],
        resources: ['events'],
        verbs: ['create', 'update', 'patch'],
      },
    ],
  };

  const clusterRoleBinding = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'ClusterRoleBinding',
    metadata: {
      name: `run-${name}`,
    },
    subjects: [{ kind: 'ServiceAccount', name, namespace }],
    roleRef: {
      kind: 'ClusterRole',
      name: `${name}-runner`,
      apiGroup: 'rbac.authorization.k8s.io',
    },
  };

  const role = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'Role',
    metadata: {
      name: `leader-locking-${name}`,
      namespace,
    },
    rules: [
      {
        apiGroups: [''],
        resources: ['endpoints'],
        verbs: ['get', 'list', 'watch', 'create', 'update', 'patch'],
      },
    ],
  };

  const roleBinding = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'RoleBinding',
    metadata: {
      name: `leader-locking-${name}`,
      namespace,
    },
    subjects: [
      {
        kind: 'ServiceAccount',
        name,
        namespace,
      },
    ],
    roleRef: {
      kind: 'Role',
      name: `leader-locking-${name}`,
      apiGroup: 'rbac.authorization.k8s.io',
    },
  };

  const deployment = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name,
      namespace,
    },
    spec: {
      selector: {
        matchLabels: {
          app: name,
        },
      },
      replicas: 1,
      strategy: {
        type: 'Recreate',
      },
      template: {
        metadata: {
          labels: { app: name },
        },
        spec: {
          serviceAccountName: `nfs-client-provisioner`,
          containers: [
            {
              name,
              image: `k8s.gcr.io/sig-storage/nfs-subdir-external-provisioner:v4.0.2`,
              volumeMounts: [
                {
                  name: `nfs-client-root`,
                  mountPath: `/persistentvolumes`,
                },
              ],
              env: [
                {
                  name: 'PROVISIONER_NAME',
                  value: provisionerName,
                },
                {
                  name: 'NFS_SERVER',
                  value: server,
                },
                {
                  name: 'NFS_PATH',
                  value: '/var/nfs',
                },
              ],
            },
          ],
          volumes: [
            {
              name: `nfs-client-root`,
              nfs: {
                server,
                path: `/var/nfs`,
              },
            },
          ],
        },
      },
    },
  };

  const storageClass = {
    apiVersion: 'storage.k8s.io/v1',
    kind: 'StorageClass',
    metadata: {
      name: 'nfs-client',
    },
    provisioner: provisionerName,
    parameters: {
      pathPattern: '${.PVC.namespace}/${.PVC.annotations.nfs.io/storage-path}',
      onDelete: 'delete',
    },
  };

  const resources = [
    sa,
    clusterRole,
    clusterRoleBinding,
    role,
    roleBinding,
    storageClass,
    deployment,
  ];

  return finalize(resources, {
    // labels: selector,
    namespace,
  });
};

const NfsServer = (p?: Partial<Parameters>): KubernetesObject[] => {
  const {
    name,
    namespace,
    image,
    // clusterIP,
    // port,
    // servicePort,
    hostPath,
    // nodeSelector,
    // serviceType,
    replicas,
    provisioner,
  } = merge({}, params, p || {});
  // const selector = appNameSelector(name);

  const svc = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name,
    },
    spec: {
      ports: [
        { name: 'nfs', port: 2049 },
        { name: 'nfs-udp', port: 2049, protocol: 'UDP' },
        { name: 'nlockmgr', port: 32803 },
        { name: 'nlockmgr-dup', port: 32803, protocol: 'UDP' },
        { name: 'mountd', port: 20048 },
        { name: 'mountd-udp', port: 20048, protocol: 'UDP' },
        { name: 'rquotad', port: 875 },
        { name: 'rquotad-udp', port: 875, protocol: 'UDP' },
        { name: 'rpcbind', port: 111 },
        { name: 'rpcbind-udp', port: 111, protocol: 'UDP' },
        { name: 'statd', port: 662 },
        { name: 'statd-udp', port: 662, protocol: 'UDP' },
      ],
      // selector: {
      //   app: name,
      // },
      type: 'NodePort',
    },
  };
  // const deploy = Deployment(name, { labels: selector, replicas });
  // const volumeName = 'host-path';
  // const mountPath = '/share';

  const deploy = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: { name },
    spec: {
      replicas,
      selector: {
        matchLabels: {
          app: name,
        },
      },
      strategy: {
        type: 'Recreate',
      },
      template: {
        metadata: {
          labels: { app: name },
        },
        spec: {
          serviceAccount: `nfs-client-provisioner`,
          volumes: [
            {
              name,
              hostPath: {
                path: hostPath,
              },
            },
          ],
          containers: [
            {
              name,
              image,
              args: [`-provisioner=${provisioner}`],
              env: [
                {
                  name: 'POD_IP',
                  valueFrom: {
                    fieldRef: {
                      fieldPath: 'status.podIP',
                    },
                  },
                },
                {
                  name: 'SERVICE_NAME',
                  value: name,
                },
                {
                  name: 'POD_NAMESPACE',
                  valueFrom: {
                    fieldRef: {
                      fieldPath: 'metadata.namespace',
                    },
                  },
                },
                {
                  name: 'SHARED_DIRECTORY',
                  value: hostPath,
                },
              ],
              imagePullPolicy: 'IfNotPresent',
              ports: [
                { name: 'nfs', containerPort: 2049 },
                { name: 'nfs-udp', containerPort: 2049, protocol: 'UDP' },
                { name: 'nlockmgr', containerPort: 32803 },
                { name: 'nlockmgr-udp', containerPort: 32803, protocol: 'UDP' },
                { name: 'mountd', containerPort: 20048 },
                { name: 'mountd-udp', containerPort: 20048, protocol: 'UDP' },
                { name: 'rquotad', containerPort: 875 },
                { name: 'rquotad-udp', containerPort: 875, protocol: 'UDP' },
                { name: 'rpcbind', containerPort: 111 },
                { name: 'rpcbind-udp', containerPort: 111, protocol: 'UDP' },
                { name: 'statd', containerPort: 662 },
                { name: 'statd-udp', containerPort: 663, protocol: 'UDP' },
              ],
              securityContext: {
                // privileged: true,
                capabilities: {
                  add: [
                    'SYS_ADMIN',
                    'SETPCAP',
                    'SYS_RESOURCE',
                    'DAC_READ_SEARCH',
                  ],
                },
              },
              volumeMounts: [{ mountPath: hostPath, name }],
            },
          ],
        },
      },
    },
  };

  return finalize([svc, deploy], {
    // labels: selector,
    namespace,
  });
};

export default function () {
  const namespace = 'nfs';
  const provisioner = ClientProvisioner({ namespace });
  const server = NfsServer({ namespace });

  return [...provisioner, ...server];
}
