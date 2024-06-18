#!/usr/bin/env sh
DIR="$(dirname "$(readlink -f "$0")")"
NODE="$(which node)"
TSC="$(which tsc)"

cd $DIR

if [ ! -f "./epgUpdate.js" ]; then
    tsc ./epgUpdate.ts
fi

$NODE ./epgUpdate.js
