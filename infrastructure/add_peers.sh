#!/bin/bash

set -e

if [ -z "$1" ]; then
  filename='./config/peers.txt'
else
  filename=$1
fi

if [ -z "$2" ]; then
  node_url='http://host.docker.internal:8545'
else
  node_url=$2
fi

echo "Reading from $filename to add peers to $node_url"
counter=0
while read PEER
do
  echo $PEER
  if
    docker run --rm ethereum/client-go --exec "admin.addPeer('$PEER')" attach $node_url ;
  then
    counter=$((counter+1)) ; echo "node #$counter added"
  else
    echo "Failed to add peer"
  fi
done < $filename
