# System Bell plugin for webpack

## Installation

	npm install system-bell-webpack-plugin --save-dev

## Usage

```js
var webpack = require('webpack');
var SystemBellPlugin = require('system-bell-webpack-plugin');

// webpack configuration
var config = {
	entry: …,
	output: { … },
	plugins: [
		new SystemBellPlugin()
	],
	// …
};
module.exports = config;
```
