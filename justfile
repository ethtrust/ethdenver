setup: setup-infrastructure

setup-infrastructure:
  #!/bin/bash
  echo "Setting up the infrastructure installation"
  ./infrastructure/scripts/setup.sh 2>&1 | cat>/dev/null
  echo "Run the following command as root:"
  echo "k3s server &"

setup-client-app:
  #!/bin/bash
  cd client-app
  yarn && yarn build
  docker build -t localhost:5000/auser/client-app .

build-docker:
  #!/bin/bash
  docker build -t localhost:5000/auser/netgearapi ./netgear-api

push-docker: build-docker
  docker push localhost:5000/auser/netgearapi

deploy:
  #!/bin/bash
