# Cfg Lite

Configration or data file encryption is cumbersome, but it is essential.

CfgLite makes this behavior easy.

Encrypts all files with different values.


## Install

npm
```sh
npm install cfg-lite
```

yarn
```sh
yarn add cfg-lite
```

## Usage

### File Init

If the file does not exist, it is new created.

```typescript
import CfgLite from 'cfg-lite';

const cfg = new CfgLite('/path/to/file.cfg');
```

### Get

All keys are separated by periods. Therefore, the key cannot contain periods.

If the value doesn't exist, it returns undefined like [optional chaining](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Optional_chaining).

The object is returned as a [deep copy](https://lodash.com/docs/4.17.15#cloneDeep).

```javascript
/*
cfg data
{
	key1: 'hello',
}
*/
cfg.get('key1'); // 'hello'
cfg.get('key1.key2.key-key'); // undefined
```

### Set

```javascript
/*
cfg data
{
}
*/

cfg.set('key1.key2', 55); // ok
cfg.set('key3.key4.key5', cfg.get('key1')); // ok

/*
result cfg data
{
	key1: {
		key2: 55
	},
	key3: {
		key4: {
			key5: {
				key1: {
					key2: 55
				},
			},
		},
	}
}
```

### Merge

Overwrite the object with new values.

```javascript
/*
cfg data
{
	key1: {
		key2: 11,
		key3: 22
	}
}
*/

cfg.merge('key1', { key2: 33, key4: 55 });

/*
result cfg data
{
	key1: {
		key2: 33,
		key3: 22,
		key4: 55
	}
}
```

### Delete
```javascript
/*
cfg data
{
	key1: 'hello'
}

cfg.delete('key1');

/*
result cfg data
{
}
*/
```

Or you can clear all values.

```javascript
cfg.deleteAll();
```

### Save

It is inefficient to write a file every time there is a new change.
To save the changes to a file you need to use the following function.

```javascript
cfg.save();
```


Thanks.
