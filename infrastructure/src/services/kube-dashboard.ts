import { finalize } from '@dpu/jkcfg-k8s';

export const KubeDashboard = () => {
  const name = 'admin-user';
  const namespace = 'kubernetes-dashboard';

  const adminUser = {
    apiVersion: 'v1',
    kind: 'ServiceAccount',
    metadata: {
      name,
      namespace,
    },
  };

  const adminUserRole = {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'ClusterRoleBinding',
    metadata: { name },
    roleRef: {
      apiGroup: 'rbac.authorization.k8s.io',
      kind: 'ClusterRole',
      name: 'cluster-admin',
    },
    subjects: [{ kind: 'ServiceAccount', name, namespace }],
  };

  return finalize([adminUser, adminUserRole], {
    labels: { app: name },
    namespace,
  });
};

export default KubeDashboard;
