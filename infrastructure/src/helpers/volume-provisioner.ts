import {
  appNameSelector,
  Container,
  Deployment,
  finalize,
  VolumeTypes,
} from '@dpu/jkcfg-k8s';
import { isUndefined, merge } from 'lodash-es';
import { Image, Name, Namespace } from '@dpu/jkcfg-k8s/parameters';
import { String } from '@jkcfg/std/param';

export interface Parameters {
  name?: string;
  namespace?: string;
  image?: string;
  provisionerName?: string;
  nfs: {
    server: string;
    path: string;
  };
  serviceAccount?: string;
}

export const params: Partial<Parameters> = {
  name: Name('nfs-client-provisioner'),
  namespace: Namespace('nfs-client-provisioner'),
  image: Image('vbouchaud/nfs-client-provisioner:latest'),
  provisionerName: String('provisionerName', 'nfs-provisioner')!,
  nfs: {
    server: String('nfs.server')!,
    path: String('nfs.path', '/')!,
  },
  serviceAccount: String('serviceAccount', 'nfs-client-provisioner'),
};
const NfsClientProvisioner = (p?: Parameters) => {
  const { name, image, provisionerName, nfs, namespace } = merge(params, p);
  const selector = appNameSelector(name);

  if (isUndefined(provisionerName)) {
    throw new Error('provisioner name must be set');
  }
  if (isUndefined(nfs.server)) throw new Error('server host must be set');

  const path = nfs.path || '/';
  const volName = 'nfs-client-root';

  const deploy = Deployment(name, { labels: selector });
  deploy.addVolume(volName, VolumeTypes.nfs, {
    server: nfs.server,
    path,
  });

  const container = Container({
    name,
    image,
    env: {
      PROVISIONER_NAME: provisionerName,
      NFS_SERVER: nfs.server,
      NFS_PATH: path,
    },
  });
  // TODO: handle container volume mounts more elegantly
  container.volumeMounts = [
    {
      name: volName,
      mountPath: '/persistentvolumes',
    },
  ];

  deploy.addContainer(container);

  // TODO: RBAC
  // const crName = 'nfs-client-provisioner-runner';
  // const cr = new k8s.rbac.v1.ClusterRole()

  return finalize([deploy.resource, storageClass(name, provisionerName)], {
    labels: selector,
    namespace,
  });
};

// TODO: break out into @dpu/jkcfg-k8s
// https://github.com/digital-plumbers-union/jkcfg/issues/15
const storageClass = (name: string, provisioner: string) => ({
  apiVersion: 'storage.k8s.io/v1',
  kind: 'StorageClass',
  metadata: { name },
  provisioner,
  parameters: {
    archiveOnDelete: 'false',
  },
});

export { NfsClientProvisioner };
