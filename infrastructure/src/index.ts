import buildCluster from './cluster';
import buildTesters from './testers';

export default async function () {
  const cluster = await buildCluster();
  const testers = await buildTesters();
  return [...cluster, ...testers];
}
