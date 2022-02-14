export const fasterStorageClass = {
  apiVersion: 'storage.k8s.io/v1',
  kind: 'StorageClass',
  metadata: { name: 'faster' },
  provisioner: 'kubernetes.io/no-provisioner',
  volumeBindingMode: 'WaitForFirstConsumer',
};

export default [fasterStorageClass];
