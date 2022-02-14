#!/usr/bin/env bash

set -e

BASE_DIR=$(realpath $(dirname $0))
cd $BASE_DIR/vendor/graph-node/docker

if ! which docker 2>&1 > /dev/null; then
    echo "Please install 'docker'"
    exit 1
fi

if ! which docker-compose 2>&1 > /dev/null; then
    echo "Please install 'docker-compose'"
    exit 1
fi

if ! which jq 2>&1 > /dev/null; then
    echo "Please install 'jq'"
    exit 1
fi

if ! which graph > /dev/null; then
  npm install -g @graphprotocol/graph-cli
fi

function start_network {
    docker-compose up
}

trap start_network EXIT


