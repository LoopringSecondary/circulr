var GeomLabels = require('./geom-labels');
var PolarLabels = require('./polar-labels');
var PieLabels = require('./pie-labels');

var Labels = {
  getLabelsClass: function getLabelsClass(coordType) {
    var rst = GeomLabels;
    if (coordType === 'polar') {
      rst = PolarLabels;
    } else if (coordType === 'theta') {
      // pie chart
      rst = PieLabels;
    }
    return rst;
  }
};

module.exports = Labels;