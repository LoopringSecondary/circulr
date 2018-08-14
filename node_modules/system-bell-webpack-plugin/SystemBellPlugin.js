function SystemBellPlugin(options) {

}

SystemBellPlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', function(stats) {
    if (stats.hasErrors()) {
      makeSound();
    }
  });
};

function makeSound() {
  process.stdout.write('\x07');
}

module.exports = SystemBellPlugin;