const expect = require('chai').expect;
const interaction = require('../../src/index');

describe('sample', () => {
  it('interaction', () => {
    expect('interaction').to.be.a('string');
    expect(interaction).to.be.an('object');
  });
});
