/*
 * utils.ts
 * Created on Wed Sep 09 2020
 *
 * Copyright (c) Tree Some. Licensed under the MIT License.
 */

let modules: any = {};
if ( typeof window === 'undefined' ) {
	modules = require('./node').default;
} else {
	// for electron
	modules = window.require('./win');
}

export const IV_LENGTH = 16;

export const shaHash = (str: string, pad: number=0) => modules.crypto.createHash('sha256').update(str).digest('hex').substring(0, (IV_LENGTH*2) - pad);
export const randomBytes = () => modules.crypto.randomBytes(IV_LENGTH);

export const getObject = (key: string|string[], obj: any, midx: number = 0, rtn: any = obj): any => {
	if ( Array.isArray(key) ) {
		if ( rtn === undefined || key.length-midx <= 0 ) {
			if ( key.length > 0 ) {
				return {
					d: rtn,
					k: key[0]
				};
			}
			return rtn;
		} else {
			const k = key.shift() as string;
			if ( k ) {
				rtn = rtn[k];
				if ( rtn === undefined ) {
					return;
				}
			} else {
				return;
			}
		}
	} else if ( typeof key === 'string' ) {
		key = key.split('.');
	}
	return getObject(obj, key, midx, rtn);
};

export const setObject = (sk: string[], value: any, obj: any = {}) => {
	if ( !sk ) return false;

	const key = sk.shift();
	if ( !key ) {
		return false;
	}

	if ( sk.length === 0 ) {
		obj[key] = value;
		return true;
	}

	if ( typeof obj[key] === 'undefined' ) {
		obj[key] = {};
	}

	setObject(sk, value, obj[key]);
};

export const writeObject = (sk: string[], value: any, obj: any = {}, kidx: number = 0) => {
	const skey: string = sk[kidx];
	if ( sk.length-1 === kidx ) {
		const oldValue = obj[skey];

		if ( typeof oldValue === "object" && typeof value === "object" ) {
			const newKeys = Object.keys(value);
			newKeys.forEach(k => {
				oldValue[k] = value[k];
			});
		} else {
			obj[skey] = value;
		}
		return;
	}

	if ( typeof obj[skey] === "undefined" ) {
		obj[skey] = {};
	}

	writeObject(obj[skey], kidx+1);
};

export const deleteObject = (key: string, obj: any) => {
	const search = getObject(key, obj, 1);
	if ( search ) {
		if ( typeof search.k === 'string' && typeof search.d !== 'undefined' ) {
			const { d, k } = search;
			delete d[k];
			return true;
		}
	}
	return false;
};
