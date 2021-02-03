#!/usr/bin/env node

import CfgLite from './index';

const printHelp = () => {
	console.log(`Usage: ${process.argv[1]} [cfg file] [key]`);
	process.exit(1);
}

const argv = process.argv.slice(2);
if ( argv.length < 1 ) {
	printHelp();
}

const cfg = new CfgLite(argv[0], argv[1] || '');
const json = cfg.get();

console.log(JSON.stringify(json, null, '\t'));
