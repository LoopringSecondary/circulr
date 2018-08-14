const Util = require('./util');
const Interaction = require('./base');

class Select extends Interaction {
  getDefaultCfg() {
    const defaultCfg = super.getDefaultCfg();
    return Util.mix({}, defaultCfg, {
      startEvent: 'mouseup',
      processEvent: null,
      selectStyle: {
        fillOpacity: 1
      },
      unSelectStyle: {
        fillOpacity: 0.1
      },
      cancelable: true
    });
  }

  start(ev) {
    const self = this;
    const chart = self.view;

    let selectedShape;
    const unSelectedShapes = [];
    chart.eachShape((obj, shape) => {
      if (shape.isPointInPath(ev.x, ev.y)) {
        selectedShape = shape;
      } else {
        unSelectedShapes.push(shape);
      }
    });

    if (!selectedShape) {
      self.reset();
      return;
    }

    if (selectedShape.get('_selected')) { // 已经被选中
      if (!self.cancelable) { // 不允许取消选中则不处理
        return;
      }
      self.reset(); // 允许取消选中
    } else { // 未被选中
      const { selectStyle, unSelectStyle } = self;

      if (!selectedShape.get('_originAttrs')) {
        const originAttrs = Object.assign({}, selectedShape.attr());
        selectedShape.set('_originAttrs', originAttrs);
      }

      selectedShape.attr(Object.assign({}, selectedShape.get('_originAttrs'), selectStyle));

      Util.each(unSelectedShapes, child => {
        if (!child.get('_originAttrs')) {
          const originAttrs = Object.assign({}, child.attr());
          child.set('_originAttrs', originAttrs);
        } else {
          child.attr(child.get('_originAttrs'));
        }
        child.set('_selected', false);
        unSelectStyle && child.attr(Object.assign({}, child.get('_originAttrs'), unSelectStyle));
      });

      selectedShape.set('_selected', true);
      self.selectedShape = selectedShape;
      self.canvas.draw();
    }
  }

  end(ev) {
    const selectedShape = this.selectedShape;
    if (selectedShape && !selectedShape.get('destroyed') && selectedShape.get('origin')) {
      ev.data = selectedShape.get('origin')._origin; // 绘制数据，包含原始数据啊
      ev.shapeInfo = selectedShape.get('origin');
      ev.shape = selectedShape;
      ev.selected = !!selectedShape.get('_selected'); // 返回选中的状态
    }
  }

  reset() {
    const self = this;
    if (!self.selectedShape) {
      return;
    }
    const chart = self.view;
    const geom = chart.get('geoms')[0];
    const container = geom.get('container').get('children')[0];
    const children = container.get('children');

    Util.each(children, child => {
      const originAttrs = child.get('_originAttrs');
      if (originAttrs) {
        child.__attrs = originAttrs;
        child.set('_originAttrs', null);
      }
      child.set('_selected', false);
    });
    self.canvas.draw();
  }
}

module.exports = Select;
