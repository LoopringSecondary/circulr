const expect = require('chai').expect;
const attr = require('../../src/index');

describe('#1', () => {
  it('description', () => {
    expect('attr').to.be.a('string');
    expect(attr).to.be.an('object');
  });
});
