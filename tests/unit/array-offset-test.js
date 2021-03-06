/* global QUnit */
import Em from 'ember';
import ArrayOffset from 'array-offset';

QUnit.module('ArrayOffset');

QUnit.test('constructor exists', function (assert) {
	assert.ok(ArrayOffset, 'ArrayOffset is not null or undefined');
	assert.equal(typeof ArrayOffset, 'function', 'ArrayOffset is function');
});

QUnit.test('can be initialized without content', function (assert) {
	assert.ok(ArrayOffset.create(), 'ArrayOffset is created without content');
});

QUnit.test('content is initialized', function (assert) {
	var arr = Em.A(['a', 'b', 'c']);
	var proxy = ArrayOffset.create({
		content: arr
	});
	assert.equal(proxy.get('arrangedContent.length'), 3);
	assert.equal(proxy.get('content.length'), 3);
	assert.equal(proxy.get('length'), 3);
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c']);
});

QUnit.test('default offset', function (assert) {
	var proxy = ArrayOffset.create();
	assert.equal(proxy.get('offset'), 0, 'Default offset is zero');
});

QUnit.test('can be initialized with offset', function (assert) {
	var arr = Em.A(['a', 'b', 'c', 'd', 'e', 'f']);
	var proxy = ArrayOffset.create({
		content: arr,
		offset: 3
	});
	assert.equal(proxy.get('offset'), 3, 'Can set offset');
	assert.deepEqual(proxy.toArray(), ['d', 'e', 'f']);
});

QUnit.test('offset cannot be negative', function (assert) {
	var proxy = ArrayOffset.create({
		offset: -1
	});
	assert.equal(proxy.get('offset'), 0, 'Initialized with -1 offset');
	proxy.set('offset', -2);
	assert.equal(proxy.get('offset'), 0, 'Offset property set to -2');
	proxy.decrementProperty('offset');
	assert.equal(proxy.get('offset'), 0, 'Offset property decremented');
});

QUnit.test('can update offset', function (assert) {
	var arr = Em.A(['a', 'b', 'c', 'd', 'e', 'f']);
	var proxy = ArrayOffset.create({
		content: arr
	});
	assert.equal(proxy.objectAt(0), 'a', 'Default offset');
	proxy.set('offset', 1);
	assert.equal(proxy.objectAt(0), 'b', 'Offset of 1');
	proxy.set('offset', 5);
	assert.equal(proxy.objectAt(0), 'f', 'Offset of 5');
	proxy.set('offset', 6);
	assert.equal(proxy.objectAt(0), undefined, 'Offset of content length');
});

QUnit.test('length is updated', function (assert) {
	var arr = Em.A(['a', 'b', 'c', 'd', 'e', 'f']);
	var proxy = ArrayOffset.create({
		content: arr
	});
	assert.equal(proxy.get('length'), 6, 'Default offset');
	proxy.set('offset', 1);
	assert.equal(proxy.get('length'), 5, 'Offset of 1');
	proxy.set('offset', 5);
	assert.equal(proxy.get('length'), 1, 'Offset of 5');
	proxy.set('offset', 6);
	assert.equal(proxy.get('length'), 0, 'Offset of content length');
});

QUnit.test('can push with no offset', function (assert) {
	var arr = Em.A(['a', 'b', 'c']);
	var proxy = ArrayOffset.create({
		content: arr
	});
	assert.equal(proxy.get('length'), 3, 'Initial length');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c'], 'Initial length');
	arr.pushObject('d');
	assert.equal(proxy.get('length'), 4, 'Pushed 1 object');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c', 'd'], 'Pushed 1 object');
	arr.pushObjects(['e', 'f']);
	assert.equal(proxy.get('length'), 6, 'Pushed 2 objects');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c', 'd', 'e', 'f'], 'Pushed 2 objects');
});

QUnit.test('can push with offset', function (assert) {
	var arr = Em.A(['a', 'b', 'c']);
	var proxy = ArrayOffset.create({
		content: arr,
		offset: 3
	});
	assert.equal(proxy.get('length'), 0, 'Initial length');
	assert.deepEqual(proxy.toArray(), [], 'Initial length');
	arr.pushObject('d');
	assert.equal(proxy.get('length'), 1, 'Pushed 1 object');
	assert.deepEqual(proxy.toArray(), ['d'], 'Pushed 1 object');
	arr.pushObjects(['e', 'f']);
	assert.equal(proxy.get('length'), 3, 'Pushed 2 objects');
	assert.deepEqual(proxy.toArray(), ['d', 'e', 'f'], 'Pushed 2 objects');
});

QUnit.test('can pop with no offset', function (assert) {
	var arr = Em.A(['a', 'b', 'c']);
	var proxy = ArrayOffset.create({
		content: arr
	});
	assert.equal(proxy.get('length'), 3, 'Initial length');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c'], 'Initial length');
	assert.equal(arr.popObject(), 'c', 'Can pop last object');
	assert.equal(proxy.get('length'), 2, 'Popped last object');
	assert.deepEqual(proxy.toArray(), ['a', 'b'], 'Popped last object');
	assert.equal(arr.popObject(), 'b', 'Can pop next last object');
	assert.equal(proxy.get('length'), 1, 'Popped next last object');
	assert.deepEqual(proxy.toArray(), ['a'], 'Popped next last object');
});

QUnit.test('can pop with offset', function (assert) {
	var arr = Em.A(['a', 'b', 'c', 'd', 'e', 'f']);
	var proxy = ArrayOffset.create({
		content: arr,
		offset: 3
	});
	assert.equal(proxy.get('length'), 3, 'Initial length');
	assert.deepEqual(proxy.toArray(), ['d', 'e', 'f'], 'Initial length');
	assert.equal(arr.popObject(), 'f', 'Can pop last object');
	assert.equal(proxy.get('length'), 2, 'Popped last object');
	assert.deepEqual(proxy.toArray(), ['d', 'e'], 'Popped last object');
	assert.equal(arr.popObject(), 'e', 'Can pop next last object');
	assert.equal(proxy.get('length'), 1, 'Popped next last object');
	assert.deepEqual(proxy.toArray(), ['d'], 'Popped next last object');
	assert.equal(arr.popObject(), 'd', 'Can pop final object');
	assert.equal(proxy.get('length'), 0, 'Popped final object');
	assert.deepEqual(proxy.toArray(), [], 'Popped final object');
	assert.equal(arr.popObject(), 'c', 'Nothing left to pop');
	assert.equal(proxy.get('length'), 0, 'Nothing left to pop');
	assert.deepEqual(proxy.toArray(), [], 'Nothing left to pop');
});

QUnit.test('can unshift with no offset', function (assert) {
	var arr = Em.A(['d', 'e', 'f']);
	var proxy = ArrayOffset.create({
		content: arr
	});
	assert.equal(proxy.get('length'), 3, 'Initial length');
	assert.deepEqual(proxy.toArray(), ['d', 'e', 'f'], 'Initial length');
	arr.unshiftObject('c');
	assert.equal(proxy.get('length'), 4, 'Shift 1 object');
	assert.deepEqual(proxy.toArray(), ['c', 'd', 'e', 'f'], 'Shift 1 object');
	arr.unshiftObjects(['a', 'b']);
	assert.equal(proxy.get('length'), 6, 'Shift 2 objects');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c', 'd', 'e', 'f'], 'Shift 2 objects');
});

QUnit.test('can unshift with offset', function (assert) {
	var arr = Em.A(['d', 'e', 'f']);
	var proxy = ArrayOffset.create({
		content: arr,
		offset: 3
	});
	assert.equal(proxy.get('length'), 0, 'Initial length');
	assert.deepEqual(proxy.toArray(), [], 'Initial length');
	arr.unshiftObject('c');
	assert.equal(proxy.get('length'), 1, 'Shift 1 object');
	assert.deepEqual(proxy.toArray(), ['f'], 'Shift 1 object');
	arr.unshiftObjects(['a', 'b']);
	assert.equal(proxy.get('length'), 3, 'Shift 2 objects');
	assert.deepEqual(proxy.toArray(), ['d', 'e', 'f'], 'Shift 2 objects');
});

QUnit.test('can shift with no offset', function (assert) {
	var arr = Em.A(['a', 'b', 'c', 'd', 'e', 'f']);
	var proxy = ArrayOffset.create({
		content: arr
	});
	assert.equal(proxy.get('length'), 6, 'Initial length');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c', 'd', 'e', 'f'], 'Initial length');
	assert.equal(arr.shiftObject(), 'a', 'Shift first object');
	assert.equal(proxy.get('length'), 5, 'Shift first object');
	assert.deepEqual(proxy.toArray(), ['b', 'c', 'd', 'e', 'f'], 'Shift first object');
	assert.equal(arr.shiftObject(), 'b', 'Shift second object');
	assert.equal(proxy.get('length'), 4, 'Shift second object');
	assert.deepEqual(proxy.toArray(), ['c', 'd', 'e', 'f'], 'Shift second object');
	assert.equal(arr.shiftObject(), 'c', 'Shift third object');
	assert.equal(proxy.get('length'), 3, 'Shift third object');
	assert.deepEqual(proxy.toArray(), ['d', 'e', 'f'], 'Shift third object');
});

QUnit.test('can shift with offset', function (assert) {
	var arr = Em.A(['a', 'b', 'c', 'd', 'e', 'f']);
	var proxy = ArrayOffset.create({
		content: arr,
		offset: 3
	});
	assert.equal(proxy.get('length'), 3, 'Initial length');
	assert.deepEqual(proxy.toArray(), ['d', 'e', 'f'], 'Initial length');
	assert.equal(arr.shiftObject(), 'a', 'Shift first object');
	assert.equal(proxy.get('length'), 2, 'Shift first object');
	assert.deepEqual(proxy.toArray(), ['e', 'f'], 'Shift first object');
	assert.equal(arr.shiftObject(), 'b', 'Shift second object');
	assert.equal(proxy.get('length'), 1, 'Shift second object');
	assert.deepEqual(proxy.toArray(), ['f'], 'Shift second object');
	assert.equal(arr.shiftObject(), 'c', 'Shift third object');
	assert.equal(proxy.get('length'), 0, 'Shift third object');
	assert.deepEqual(proxy.toArray(), [], 'Shift third object');
});

QUnit.test('can replace with no offset', function (assert) {
	var arr = Em.A(['a', 'b', 'x', 'y', 'z']);
	var proxy = ArrayOffset.create({
		content: arr
	});
	assert.equal(proxy.get('length'), 5, 'Initial array');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'x', 'y', 'z'], 'Initial array');
	arr.replace(2, 0, ['c']);
	assert.equal(proxy.get('length'), 6, 'Insert "c"');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c', 'x', 'y', 'z'], 'Insert "c"');
	arr.replace(3, 3, ['d', 'e', 'f']);
	assert.equal(proxy.get('length'), 6, 'Replace XYZ with DEF');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c', 'd', 'e', 'f'], 'Replace XYZ with DEF');
	arr.replace(1, 4);
	assert.equal(proxy.get('length'), 2, 'Remove BCDE');
	assert.deepEqual(proxy.toArray(), ['a', 'f'], 'Remove BCDE');
	arr.replace(0, 2);
	assert.equal(proxy.get('length'), 0, 'Remove AF');
	assert.deepEqual(proxy.toArray(), [], 'Remove AF');
	arr.replace(0, 0, ['x', 'y', 'z']);
	assert.equal(proxy.get('length'), 3, 'Insert XYZ');
	assert.deepEqual(proxy.toArray(), ['x', 'y', 'z'], 'Insert XYZ');
	arr.replace(0, 3, ['a', 'b', '1', '2', 'e', 'f']);
	assert.equal(proxy.get('length'), 6, 'Replace XYZ with AB12EF');
	assert.deepEqual(proxy.toArray(), ['a', 'b', '1', '2', 'e', 'f'], 'Replace XYZ with AB12EF');
	arr.replace(2, 2, ['c', 'd']);
	assert.equal(proxy.get('length'), 6, 'Replace 12 with CD');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c', 'd', 'e', 'f'], 'Replace 12 with CD');
});

QUnit.test('can replace with offset', function (assert) {
	var arr = Em.A(['a', 'b', 'x', 'y', 'z']);
	var proxy = ArrayOffset.create({
		content: arr,
		offset: 3
	});
	assert.equal(proxy.get('length'), 2, 'Initial array');
	assert.deepEqual(proxy.toArray(), ['y', 'z'], 'Initial array');
	arr.replace(2, 0, ['c']);
	assert.equal(proxy.get('length'), 3, 'Insert "c"');
	assert.deepEqual(proxy.toArray(), ['x', 'y', 'z'], 'Insert "c"');
	arr.replace(3, 3, ['d', 'e', 'f']);
	assert.equal(proxy.get('length'), 3, 'Replace XYZ with DEF');
	assert.deepEqual(proxy.toArray(), ['d', 'e', 'f'], 'Replace XYZ with DEF');
	arr.replace(1, 4);
	assert.equal(proxy.get('length'), 0, 'Remove BCDE');
	assert.deepEqual(proxy.toArray(), [], 'Remove BCDE');
	arr.replace(0, 2);
	assert.equal(proxy.get('length'), 0, 'Remove AF');
	assert.deepEqual(proxy.toArray(), [], 'Remove AF');
	arr.replace(0, 0, ['x', 'y', 'z']);
	assert.equal(proxy.get('length'), 0, 'Insert XYZ');
	assert.deepEqual(proxy.toArray(), [], 'Insert XYZ');
	arr.replace(0, 3, ['a', 'b', '1', '2', 'e', 'f']);
	assert.equal(proxy.get('length'), 3, 'Replace XYZ with AB12EF');
	assert.deepEqual(proxy.toArray(), ['2', 'e', 'f'], 'Replace XYZ with AB12EF');
	arr.replace(2, 2, ['c', 'd']);
	assert.equal(proxy.get('length'), 3, 'Replace 12 with CD');
	assert.deepEqual(proxy.toArray(), ['d', 'e', 'f'], 'Replace 12 with CD');
});
