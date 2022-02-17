deploy: setup-infrastructure build-docker push-docker deploy-infrastructure

setup-infrastructure:
  #!/bin/bash
  echo "Setting up the infrastructure installation"
  ./infrastructure/scripts/setup.sh 2>&1 | cat>/dev/null
  (cd infrastructure && yarn)
  (cd netgear-api && yarn)
  (cd poe-listener && yarn)
  (cd poe-toggle-event-emitter-api && yarn)
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

setup: setup-client-app setup-poe-listener setup-event-emitter-api setup-poe-listener

setup-client-app:
  #!/bin/bash
  cd client-app
  docker build -t localhost:5000/auser/client-app .

setup-event-emitter-api:
  #!/bin/bash
  cd poe-toggle-event-emitter-api
  node ./scripts/compile-contract.js
  node ./scripts/deploy-contract.js
  files=$(find ../infrastructure/generated -type f -name "*poe-event-emitter*.yaml")
  for file in $files; do
    k3s kubectl apply -f $file 2>/dev/null
  done

setup-poe-listener:
  #!/bin/bash
  cd poe-listener
  yarn

build-docker:
  #!/bin/bash
  docker build -t ethtrust/clientapp ./client-app
  docker build -t ethtrust/netgearapi ./netgear-api
  docker build -t ethtrust/poelistener ./poe-listener
  docker build -t ethtrust/eventemitterapi ./poe-toggle-event-emitter-api

package-docker: build-docker
  #!/bin/bash
  mkdir -p ./package
  docker save -o ./package/clientapp.tar ethtrust/clientapp
  docker save -o ./package/netgearapi ethtrust/netgearapi
  docker save -o ./package/poelistener ethtrust/poelistener
  docker save -o ./package/eventemitterapi ethtrust/eventemitterapi

#
push-docker: build-docker
  docker image tag ethtrust/poelistener localhost:5000/ethtrust/poelistener
  docker image tag ethtrust/poelistener docker-registry.docker-registry.svc.cluster.local:5000/ethtrust/poelistener
  docker image push localhost:5000/ethtrust/poelistener
  docker image tag ethtrust/clientapp localhost:5000/ethtrust/clientapp
  docker image tag ethtrust/clientapp 192.168.0.232:5000/ethtrust/clientapp
  docker image push localhost:5000/ethtrust/client-app
  docker image tag ethtrust/netgearapi localhost:5000/ethtrust/netgearapi
  docker image tag ethtrust/netgearapi 192.168.0.232:5000/ethtrust/netgearapi
  docker image push localhost:5000/ethtrust/netgearapi
  docker image tag ethtrust/eventemitterapi localhost:5000/ethtrust/eventemitterapi
  docker image tag ethtrust/eventemitterapi 192.168.0.232:5000/ethtrust/eventemitterapi
  docker image push localhost:5000/ethtrust/eventemitterapi

start-docker-registry:
  #!/bin/bash
  files=$(find ./infrastructure/generated -type f -name "*docker-registry*.yaml")
  for file in $files; do
    echo $file
    k3s kubectl apply -f $file 2>/dev/null
  done
  registry_id=$(kubectl get pods -n docker-registry -ojson | jq -r 'last(.items[]|select(.status.phase == "Running")| .metadata.name)')
  kubectl port-forward -n docker-registry $registry_id 5000 & 2>&1 >/dev/null

