#!/usr/bin/env node

const spawn = require('cross-spawn');


async function run() {
    await spawn('plop', { stdio: 'inherit' });
}

run()