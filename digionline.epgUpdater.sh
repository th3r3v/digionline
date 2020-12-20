#!/usr/bin/env sh
NODE="$(which node)"
TSC="$(which tsc)"

if [ ! -f "./epgUpdate.js" ]; then
    tsc ./epgUpdate.ts
fi

$NODE ./epgUpdate.js
