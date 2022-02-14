
#!/bin/bash

set -ex

MICROK8S=$(which k3s)

if [ -z "$MICROK8S" ]; then
  curl -sfL https://get.k3s.io | sh -
fi

GITHUB_URL=https://github.com/kubernetes/dashboard/releases
VERSION_KUBE_DASHBOARD=$(curl -w '%{url_effective}' -I -L -s -S ${GITHUB_URL}/latest -o /dev/null | sed -e 's|.*/||')
k3s kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/${VERSION_KUBE_DASHBOARD}/aio/deploy/recommended.yaml



# $MICROK8S kubectl apply -f https://openebs.github.io/charts/openebs-operator-lite.yaml
# $MICROK8S kubectl apply -f https://openebs.github.io/charts/openebs-lite-sc.yaml

