import { IFileConfigMap, readFile, basename, IMapping } from '../utils';
import * as k8s from '@jkcfg/kubernetes/api';

export const ConfigMap = async (
  name: string,
  { namespace, files }: IFileConfigMap
) => {
  const data: IMapping = await files.reduce(
    async (acc: Promise<IMapping>, filename: string) => {
      const nextAcc = await acc;
      const contents = await readFile(filename);
      const key = basename(filename);
      return {
        ...nextAcc,
        [key]: contents,
      };
    },
    Promise.resolve({})
  );

  return new k8s.core.v1.ConfigMap(name, {
    metadata: {
      namespace: namespace,
      labels: {
        app: name,
      },
    },
    data,
  });
};
