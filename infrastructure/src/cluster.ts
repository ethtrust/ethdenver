import { valuesForGenerate } from '@jkcfg/kubernetes/generate';
import Openethereum from './services/openethereum';
import PrysmBeacon from './services/prysm';
import MobileApp from './services/mobile-app';
// import nfsServer from './services/nfs-server';
import kubeDashboard from './services/kube-dashboard';
import POEListener from './services/poe-listener';
import PrivateRegistry from './services/private-registry';

export const cluster = async () => {
  const resources = [
    ...(await kubeDashboard()),
    // ...(await nfsServer()),
    ...(await PrivateRegistry()),
    ...(await Openethereum()),
    ...(await PrysmBeacon()),
    ...(await MobileApp()),
    ...(await POEListener()),
  ];

  const manifests = valuesForGenerate(resources);
  return manifests;
};

export default cluster;
