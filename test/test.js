'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    Minimize = require('minimize'),
    hbattribs = require('../index.js'),
    minimize;

chai.use(sinonChai);
chai.config.includeStack = true;

describe('minimize-handlebars-attribs', function () {
  beforeEach(function () {
    minimize = new Minimize({
      plugins: [ hbattribs ],
      spare: false, // not compatible with spare
      loose: false, // for testing, we don't want that
      empty: true,
      cdata: true,
      comments: true,
      ssi: true,
      conditionals: true,
      quotes: true
    });
  });

  afterEach(function () {
    minimize = null;
  });

  it('should export an id', function () {
    expect(hbattribs.id).to.be.a('string');
  });

  it('should export an element function', function () {
    expect(hbattribs.element).to.be.a('function');
  });

  it('should keep handlebars block expression inside HTML tags', function() {
    var html = '<option id="myId" class="my-class your-class" {{#if selected}}selected{{/if}}>An option</option>',
        expected = '<option id="myId" class="my-class your-class" {{#if selected}}selected{{/if}}>An option</option>';

    minimize.parse(html, function(error, data) { expect(data).to.equal(expected); });
  });

  it('should keep handlebars block expression inside HTML attributes', function() {
    var html = '<option id="myId" class="my-class your-class" selected="{{#if selected}}selected{{/if}}">An option</option>',
        expected = '<option id="myId" class="my-class your-class" selected="{{#if selected}}selected{{/if}}">An option</option>';

    minimize.parse(html, function(error, data) { expect(data).to.equal(expected); });
  });

  it('should keep handlebars block expression wrapped around HTML attributes', function() {
    var html = '<option id="myId" class="my-class your-class" {{#if selected}}selected="selected"{{/if}}>An option</option>',
        expected = '<option id="myId" class="my-class your-class" {{#if selected}}selected="selected"{{/if}}>An option</option>';

    minimize.parse(html, function(error, data) { expect(data).to.equal(expected); });
  });

  it('should keep nested handlebars object', function() {
    var html = '<select name="preset"> {{#each presets}} <option {{#ifCond this.key ../model.preset}}selected{{/ifCond}}> {{this.key}} </option> {{/each}} </select>',
        expected = '<select name="preset">{{#each presets}}<option {{#ifcond this.key ../model.preset}}selected{{/ifcond}}>{{this.key}}</option>{{/each}}</select>';

    minimize.parse(html, function(error, data) { expect(data).to.equal(expected); });
  });

  it('should not alter \'../\' segments', function() {
    var html = '<option {{#if ../../condition}}selected{{/if}}>An option</option>',
        expected = '<option {{#if ../../condition}}selected{{/if}}>An option</option>';

    minimize.parse(html, function(error, data) { expect(data).to.equal(expected); });
  });
});
