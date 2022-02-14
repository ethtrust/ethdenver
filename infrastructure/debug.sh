#!/usr/bin/env bash

set -e

JS_PERCENTAGE="
var lastPercentage = 0;var lastBlocksToGo = 0;var timeInterval = 10000;
setInterval(function(){
    var percentage = eth.syncing.currentBlock/eth.syncing.highestBlock*100;
    var percentagePerTime = percentage - lastPercentage;
    var blocksToGo = eth.syncing.highestBlock - eth.syncing.currentBlock;
    var bps = (lastBlocksToGo - blocksToGo) / (timeInterval / 1000)
    var etas = 100 / percentagePerTime * (timeInterval / 1000)

    var etaM = parseInt(etas/60,10);
    console.log(parseInt(percentage,10)+'% ETA: '+etaM+' minutes @ '+bps+'bps');

    lastPercentage = percentage;lastBlocksToGo = blocksToGo;
},timeInterval);"

docker run --rm -it -v $(pwd)/geth:/root/geth ethereum/client-go  attach ws://host.docker.internal:8546 --exec $JS_PERCENTAGE
