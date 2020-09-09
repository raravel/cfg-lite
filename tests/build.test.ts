import CfgLite from '../src';

const testCfg = new CfgLite('./cfg');
testCfg.set('a.b.c', 'Hello');
testCfg.set('c.d.e', testCfg.get('a.b.c'));
testCfg.set('a.c', 55);
testCfg.set('d', true);
console.log(testCfg.get());
testCfg.save();
testCfg.delete('a.c');
console.log(testCfg.get());
testCfg.deleteAll();
console.log(testCfg.get());

testCfg.save('./b', true);
