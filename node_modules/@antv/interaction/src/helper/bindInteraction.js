const G = require('@antv/g/src');
const CommonUtil = G.CommonUtil;

function bindInteraction(Lib, View) {
  // binding on Library
  Lib._Interactions = {};
  Lib.registerInteraction = function(type, constructor) {
    Lib._Interactions[type] = constructor;
  };
  Lib.getInteraction = function(type) {
    return G2._Interactions[type];
  };

  // binding on View
  View.prototype.getInteractions = function() {
    const me = this;
    if (!me._interactions) {
      me._interactions = {};
    }
    return me._interactions;
  };
  View.prototype._setInteraction = function(type, interaction) {
    const me = this;
    const interactions = me.getInteractions();
    if (interactions[type] && interactions[type] !== interaction) { // only one interaction for a key
      interactions[type].destroy();
    }
    interactions[type] = interaction;
  };
  View.prototype.clearInteraction = function(type) {
    const me = this;
    const interactions = me.getInteractions();
    if (type) {
      interactions[type] && interactions[type].destroy();
      delete interactions[type];
    } else {
      CommonUtil.each(interactions, (interaction, key) => {
        interaction.destroy();
        delete interactions[key];
      });
    }
  };
  View.prototype.interact = View.prototype.interaction = function(type, cfg) {
    const me = this;
    const Ctor = G2.getInteraction(type);
    const interaction = new Ctor(cfg, me);
    me._setInteraction(type, interaction);
    return me;
  };
}

module.exports = bindInteraction;
