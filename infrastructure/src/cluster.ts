import { valuesForGenerate } from '@jkcfg/kubernetes/generate';
import Openethereum from './services/openethereum';
import PrysmBeacon from './services/prysm';
import MobileApp from './services/mobile-app';
// import nfsServer from './services/nfs-server';
import kubeDashboard from './services/kube-dashboard';

export const cluster = async () => {
  const resources = [
    ...(await kubeDashboard()),
    // ...(await nfsServer()),
    ...(await Openethereum()),
    ...(await PrysmBeacon()),
    ...(await MobileApp()),
  ];

  const manifests = valuesForGenerate(resources);
  return manifests;
};

export default cluster;
