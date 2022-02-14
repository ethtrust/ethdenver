#!/bin/bash

set -ex

NAMESPACES="openethereum prysm testing nfs mobile-app"
for ns in $NAMESPACES
do
  k3s kubectl delete ns -n $ns $ns 2>&1 | cat > /dev/null
done
