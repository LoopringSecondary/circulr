const expect = require('chai').expect;
const Attr = require('../../src/index');

describe('Attr', () => {
  it('Attr', () => {
    expect(Attr).to.include.all.keys('Position', 'Shape', 'Color', 'Size', 'Opacity', 'ColorUtil');
  });
});
