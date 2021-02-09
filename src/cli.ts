#!/usr/bin/env node

import CfgLite from './index';
import fs from 'fs';

const printHelp = (msg: string) => {
	console.error(msg + '\n');
	console.error(`Usage: cfg [options] <cfg file src> <cfg file dst?>`);
	console.error('       <cfg file src>: Source cfg file path');
	console.error('       <cfg file dst>: Destination cfg file path (only decrypt mode)');
	console.error('');
	console.error('Options');
	console.error('   -e --encrypt        Encrypt cfg file');
	console.error('   -d --decrypt        Decrypt cfg file');
	console.error('   -k --key            Cfg encryption key (AES-256)');
	console.error('   -V --verbose        Print detail log');
	process.exit(1);
}

enum MODE {
	NONE = 0,
	ENCRYPT = 1,
	DECRYPT = 2,
}

const options = {
	mode: MODE.NONE,
	key: '',
	src: '',
	dst: '',
	verbose: false,
};

const parsingArgv = (argv: string[]) => {
	let i = 0, len = argv.length;
	for (i=0;i < len;i++) {
		if ( argv[i][0] === "-" ) {
			if ( argv[i][1] && argv[i][1] === "-" ) {
				// --[option]

				if ( argv[i].match(/--key=/) ) {
					options['key'] = argv[i].replace(/--key=/, '');
				} else {
					switch ( argv[i] ) {
						case '--encrypt': options['mode'] = MODE.ENCRYPT; break;
						case '--decrypt': options['mode'] = MODE.DECRYPT; break;
						case '--verbose': options['verbose'] = true; break;
						default: printHelp('Invalid Options');
					}
				}

			} else {
				// -[options]
				let len = argv[i].length;
				for (let idx = 1;idx < len;idx++) {
					switch ( argv[i][idx] ) {
						case 'e': options['mode'] = MODE.ENCRYPT; break;
						case 'd': options['mode'] = MODE.DECRYPT; break;
						case 'k': options['key'] = argv[++i]; break;
						case 'V': options['verbose'] = true; break;
						default: printHelp('Invalid Options');
					}
				}
			}
		} else {
			if ( !options['src'] ) {
				options['src'] = argv[i];
			} else if ( !options['dst'] ) {
				options['dst'] = argv[i];
			}
		}
	}
};

const isV = () => options['verbose'];

const argv = process.argv.slice(2);
if ( argv.length < 2 ) {
	printHelp('There are few arguments.');
}
parsingArgv(argv);

if ( isV() ) {
	console.log('Argv: ', argv);
}

const readJson = (p: string) => {
	if ( fs.existsSync(p) ) {
		const str = fs.readFileSync(p, { encoding: 'utf8' });
		try {
			return JSON.parse(str);
		} catch(err) {
			printHelp(`This is not json file. [${p}]`);
		}
	} else {
		printHelp(`No such cfg file [${p}]`);
	}
}

if ( options['mode'] === MODE.ENCRYPT ) {
	isV() && console.log('Encryption mode');
	const json = readJson(options['src']);
	isV() && console.log('Read json file', json);
	const cfg = new CfgLite(options['dst'], options['key']);
	cfg.set('', json);
	isV() && console.log('Setting json in cfg', cfg.get());
	cfg.save();
	isV() && console.log('Save done.', options['dst']);
} else if ( options['mode'] === MODE.DECRYPT ) {
	isV() && console.log('Decryption mode');
	const cfg = new CfgLite(options['src'], options['key']);
	isV() && console.log('Open cfg file', options['src']);
	const json = cfg.get();
	isV() && console.log('Get json', json);
	console.log(JSON.stringify(json, null, '\t'));
} else {
	printHelp('Unknwon mode');
}

