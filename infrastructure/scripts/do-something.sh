#!/bin/bash

set -ex

# Eventually use this for good
 kubectl get pods -n openethereum -ojson | jq '.items[]|select(.status.phase == "Running")| .metadata.name'
