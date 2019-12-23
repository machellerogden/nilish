'use strict';

const { inspect } = require('util');
const _ = exports;
const nt = new Set(['string', 'number']);
const SYM_META = Symbol('nilish.meta');
_.nil = void 0;
_.identity = v => v;
_.isArray = Array.isArray;
_.assign = Object.assign;
_.is = (v, t) => typeof v === t;
_.isNil = v => v == _.nil;
_.notNil = v => v != _.nil;
_.isObject = v => _.notNil(v) && _.is(v, 'object');
_.count = v =>
    _.isArray(v)      ? v.length
  : _.is(v, 'string') ? v.length
  : _.isObject(v)     ? Object.entries(v).length
  : 0;
_.isEmpty = v => _.count(v) === 0;
_.isEqual = (a, b) =>
    [ a, b ].every(_.isObject) ? Object.is(a, b)
  : a === b;
_.isFalse = _.not = v => _.isEqual(v, false);
_.isFalsy = v => _.isNil(v) || _.isFalse(v);
_.complement = fn => (...args) => _.isFalsy(fn(...args));
_.isTruthy = _.complement(_.isFalsy);
_.isZero = v => v === 0;
_.isString = v => _.is(v, 'string');
_.isNumber = v => _.is(v, 'number');
_.isNumeric = n => nt.has(typeof n) && !isNaN(parseInt(n, 10)) && isFinite(n);
_.isBoolean = v => _.is(v, 'boolean');
_.isUndefined = v => _.is(v, 'undefined');
_.isNull = v => v === null;
_.isPlainObject = v => Object.prototype.toString.call(v) === '[object Object]';
_.clone = x =>
    _.isArray(x)   ? [ ...x ].map(_.clone)
  : _.isObject(x)  ? Object.entries({ ...x }).reduce((a, [k, v]) => (a[k] = _.clone(v), a), {})
  :                x;
_.pipe = (first, ...rest) => (...args) => rest.reduce((acc, fn) => fn(acc), first(...args));
_.compose = (...fns) => (f => (...args) => _.pipe(...f)(...args))([ ...fns ].reverse());
_.partial = (fn, ...args) => (...rest) => fn(...[ ...args, ...rest ]);
_.partialRight = (fn, ...args) => (...rest) => fn(...[ ...rest, ...args ]);
_.reverse = v => _.isArray(v) ? v.reverse() : _.nil;
_.first = v => _.isArray(v) ? v[0] : _.nil;
_.last = v => _.isArray(v) ? v[v.length - 1] : _.nil;
_.butlast = v => _.isArray(v) ? v.slice(0, -1) : _.nil;
_.box = v => _.is(v, 'string')  ? new String(v)
           : _.is(v, 'number')  ? new Number(v)
           : _.is(v, 'boolean') ? new Boolean(v)
           :                    v;
_.intersperse = (d, v) => _.isArray(v)
    ? [ ...v.map(e => [d, e]).slice(1) ]
    : nil;
_.exception = msg => { throw new Error(msg); };
_.pprint = (...a) =>
    console.log(`${
        a.map(v => typeof v === 'object'
            ? inspect(v, { depth: 8, colors: true })
            : String(v)).join(' ')
    }`);
_.meta = v => _.isNil(v) ? _.nil : _.clone(v[SYM_META]) || {};
_.withMeta = (target, data) => {
    if (_.isNil(target)) return _.nil;
    const result = _.clone(target);
    const boxed = _.box(result);
    boxed[SYM_META] = data;
    return boxed;
};
