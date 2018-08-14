const expect = require('chai').expect;
const interaction = require('../../src/index');

describe('#1', () => {
  it('description', () => {
    expect('interaction').to.be.a('string');
    expect(interaction).to.be.an('object');
  });
});
