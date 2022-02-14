export interface PersistentVolumeOptions {
  storage?: string;
  namespace?: string;
  storageClassName?: string;
}
export const PersistentVolume = (
  name: string,
  opts: PersistentVolumeOptions = {}
) => {
  const namespace = opts.namespace || 'default';
  const storage = opts.storage || '5Gi';
  const storageClassName = opts.storageClassName || 'nfs';
  const persistentVolume = {
    apiVersion: 'v1',
    kind: 'PersistentVolume',
    metadata: {
      name,
      namespace,
      annotations: {
        'nfs.io/storage-path': `/${name}`,
      },
    },
    spec: {
      storageClassName,
      capacity: {
        storage,
      },
      accessModes: ['ReadWriteOnce', 'ReadWriteMany'],
      persistentVolumeReclaimPolicy: 'Recycle',
      nfs: {
        server: `nfs.nfs`,
        path: `/${name}`,
      },
      mountOptions: ['nfsvers=4.2'],
    },
  };
  return persistentVolume;
};
