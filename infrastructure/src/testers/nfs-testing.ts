import { finalize } from '@dpu/jkcfg-k8s';
import { Image, Name, Namespace } from '@dpu/jkcfg-k8s/parameters';
import { merge } from 'lodash-es';

export interface Parameters {
  name?: string;
  namespace?: string;
  image?: string;
  volumeName?: string;
  command?: string[];
  args?: string[];
}

export const params: Partial<Parameters> = {
  name: Name('nfs-testing'),
  namespace: Namespace('testing'),
  image: Image('gcr.io/google_containers/busybox:1.24'),
  volumeName: Name('nfs-pv'),
  command: ['/bin/sh'],
  args: ['-c', 'cat /mnt/bar.txt  && while [ 1 ] ; do sleep 1 ; done '],
};

export const NfsTesting = (p?: Parameters) => {
  const { name, volumeName, namespace } = merge(params, p);
  // const selector = appNameSelector(name);
  // Create storage class
  // const sc = {
  //   apiVersion: 'storage.k8s.io/v1',
  //   kind: 'StorageClass',
  //   metadata: { name: volumeName },
  //   provisioner: 'kubernetes.io/no-provisioner',
  //   reclaimPolicy: 'Delete',
  //   allowVolumeExpansion: true,
  //   mountOptions: ['debug'],
  //   volumeBindingMode: 'WaitForFirstConsumer',
  // };

  // Create a persistent volume
  const pv = {
    apiVersion: 'v1',
    kind: 'PersistentVolume',
    metadata: { name: volumeName, labels: { app: 'nfs' } },
    spec: {
      capacity: { storage: '1Mi' },
      accessModes: ['ReadWriteMany', 'ReadWriteOnce'],
      nfs: {
        server: 'nfs.nfs',
        path: '/testing',
      },
      mountOptions: ['vers=3', 'proto=tcp', 'nolock', 'noacl', 'sync'],
      storageClassName: volumeName,
    },
  };
  const pvc = {
    apiVersion: 'v1',
    kind: 'PersistentVolumeClaim',
    metadata: {
      name,
      annotations: {
        'nfs.io/storage-path': name,
      },
    },
    spec: {
      accessModes: ['ReadWriteMany'],
      storageClassName: 'nfs-client',
      resources: {
        requests: { storage: '1Mi' },
      },
      selector: {
        matchLabels: {
          app: 'nfs',
        },
      },
      volumeName,
    },
  };
  // Create a pod to grab a mount volume
  // Consume in a pod
  const pod = {
    apiVersion: 'v1',
    kind: 'Pod',
    metadata: {
      name: 'testing-web',
      namespace,
      labels: {
        app: 'testing-web',
      },
    },
    spec: {
      volumes: [
        {
          name: 'nfs',
          nfs: {
            server: 'nfs.nfs',
            // server: `10.152.183.71`,
            path: '/exports',
            readOnly: false,
          },
        },
      ],
      containers: [
        {
          name: 'testing-web',
          image: 'nginx',
          volumeMounts: [
            {
              name: 'nfs',
              mountPath: '/usr/share/nginx/html',
            },
          ],
          ports: [
            {
              name: 'testing-web',
              containerPort: 80,
              protocol: 'TCP',
            },
          ],
        },
      ],
    },
  };

  return finalize([pod, pv, pvc], {
    // labels: selector,
    namespace,
  });
};
