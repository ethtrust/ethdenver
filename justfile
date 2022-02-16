setup: setup-infrastructure

setup-infrastructure:
  #!/bin/bash
  echo "Setting up the infrastructure installation"
  ./infrastructure/scripts/setup.sh 2>&1 | cat>/dev/null
  echo "Run the following command as root:"
  echo "k3s server &"

compile-infrastructure:
  #!/bin/bash
  echo "Compiling infrastructure"
  cd ./infrastructure
  just build

deploy-infrastructure: compile-infrastructure
  #!/bin/bash
  echo "Deploying infrastructure"
  cd ./infrastructure
  just kube-apply .

reset-infrastructure:
  #!/bin/bash
  kubectl -n kube-system rollout restart daemonsets,deployments


setup-client-app:
  #!/bin/bash
  cd client-app
  docker build -t localhost:5000/auser/client-app .

setup-event-emitter-api: compile-infrastructure start-docker-registry
  #!/bin/bash
  cd poe-toggle-event-emitter-api
  # node ./scripts/compile-contract.js
  files=$(find ../infrastructure/generated -type f -name "*poe-event-emitter*.yaml")
  for file in $files; do
    k3s kubectl apply -f $file 2>/dev/null
  done

build-docker:
  #!/bin/bash
  docker build -t localhost:5000/auser/netgearapi ./netgear-api

push-docker: build-docker start-docker-registry
  docker push localhost:5000/auser/netgearapi

start-docker-registry:
  #!/bin/bash
  files=$(find ./infrastructure/generated -type f -name "*docker-registry*.yaml")
  for file in $files; do
    echo $file
    k3s kubectl apply -f $file 2>/dev/null
  done

deploy:
  #!/bin/bash
