#!/bin/bash

set -ex

# Eventually use this for good
 kubectl get pods -n openethereum -ojson | jq '.items[]|select(.status.phase == "Running")| .metadata.name'
kubectl get pods -n docker-registry -ojson | jq -r 'last(.items[]|select(.status.phase == "Running")| .metadata.name)'

kubectl port-forward -n docker-registry $(kubectl get pods -n docker-registry -ojson | jq -r 'last(.items[]|select(.status.phase == "Running")| .metadata.name)') 5000
kubectl attach -n docker-registry $(kubectl get pods -n docker-registry -ojson | jq -r 'last(.items[]|select(.status.phase == "Running")| .metadata.name)') /bin/sh
kubectl logs -n docker-registry $(kubectl get pods -n docker-registry -ojson | jq -r 'last(.items[]|select(.status.phase == "Running")| .metadata.name)')
kubectl describe pod -n docker-registry $(kubectl get pods -n docker-registry -ojson | jq -r 'last(.items[]|select(.status.phase == "Running")| .metadata.name)')
