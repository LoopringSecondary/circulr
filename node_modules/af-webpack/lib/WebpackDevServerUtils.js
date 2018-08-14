"use strict";

var _address = _interopRequireDefault(require("address"));

var _url = _interopRequireDefault(require("url"));

var _chalk = _interopRequireDefault(require("chalk"));

var _formatWebpackMessages = _interopRequireDefault(require("react-dev-utils/formatWebpackMessages"));

var _clearConsole = _interopRequireDefault(require("./clearConsole"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */
const isInteractive = process.stdout.isTTY;
let handleCompile; // You can safely remove this after ejecting.
// We only use this block for testing of Create React App itself:

const isSmokeTest = process.argv.some(arg => arg.indexOf('--smoke-test') > -1);

if (isSmokeTest) {
  handleCompile = (err, stats) => {
    if (err || stats.hasErrors() || stats.hasWarnings()) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  };
}

function prepareUrls(protocol, host, port) {
  const formatUrl = hostname => _url.default.format({
    protocol,
    hostname,
    port,
    pathname: '/'
  });

  const prettyPrintUrl = hostname => _url.default.format({
    protocol,
    hostname,
    port: _chalk.default.bold(port),
    pathname: '/'
  });

  const isUnspecifiedHost = host === '0.0.0.0' || host === '::';
  let prettyHost, lanUrlForConfig, lanUrlForTerminal;

  if (isUnspecifiedHost) {
    prettyHost = 'localhost';

    try {
      // This can only return an IPv4 address
      lanUrlForConfig = _address.default.ip();

      if (lanUrlForConfig) {
        // Check if the address is a private ip
        // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
        if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(lanUrlForConfig)) {
          // Address is private, format it for later use
          lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
        } else {
          // Address is not private, so we will discard it
          lanUrlForConfig = undefined;
        }
      }
    } catch (_e) {// ignored
    }
  } else {
    prettyHost = host;
  }

  const localUrlForTerminal = prettyPrintUrl(prettyHost);
  const localUrlForBrowser = formatUrl(prettyHost);
  return {
    lanUrlForConfig,
    lanUrlForTerminal,
    localUrlForTerminal,
    localUrlForBrowser
  };
}

function printInstructions(appName, urls, useYarn) {
  console.log();
  console.log(`You can now view ${_chalk.default.bold(appName)} in the browser.`);
  console.log();

  if (urls.lanUrlForTerminal) {
    console.log(`  ${_chalk.default.bold('Local:')}            ${urls.localUrlForTerminal}`);
    console.log(`  ${_chalk.default.bold('On Your Network:')}  ${urls.lanUrlForTerminal}`);
  } else {
    console.log(`  ${urls.localUrlForTerminal}`);
  }

  console.log();
  console.log('Note that the development build is not optimized.');
  console.log(`To create a production build, use ` + `${_chalk.default.cyan(`${useYarn ? 'yarn' : 'npm run'} build`)}.`);
  console.log();
}

function createCompiler(webpack, config, appName, urls, useYarn) {
  // "Compiler" is a low-level interface to Webpack.
  // It lets us listen to some events and provide our own custom messages.
  let compiler;

  try {
    compiler = webpack(config, handleCompile);
  } catch (err) {
    console.log(_chalk.default.red('Failed to compile.'));
    console.log();
    console.log(err.stack);
    console.log();
    process.exit(1);
  } // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.


  compiler.plugin('invalid', () => {
    if (isInteractive) {
      (0, _clearConsole.default)();
    }

    console.log('Compiling...');
  });
  let isFirstCompile = true; // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.

  compiler.plugin('done', stats => {
    if (isInteractive) {
      (0, _clearConsole.default)();
    } // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.


    const messages = (0, _formatWebpackMessages.default)(stats.toJson({}, true));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;

    if (isSuccessful) {
      console.log(_chalk.default.green('Compiled successfully!'));
    }

    if (isSuccessful && (isInteractive || isFirstCompile)) {
      printInstructions(appName, urls, useYarn);
    }

    isFirstCompile = false; // If errors exist, only show errors.

    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }

      console.log(_chalk.default.red('Failed to compile.\n'));
      console.log(messages.errors.join('\n\n'));
      return;
    } // Show warnings if no errors were found.


    if (messages.warnings.length) {
      console.log(_chalk.default.yellow('Compiled with warnings.\n'));
      console.log(messages.warnings.join('\n\n')); // Teach some ESLint tricks.

      console.log('\nSearch for the ' + _chalk.default.underline(_chalk.default.yellow('keywords')) + ' to learn more about each warning.');
      console.log('To ignore, add ' + _chalk.default.cyan('// eslint-disable-next-line') + ' to the line before.\n');
    }
  });
  return compiler;
}

function resolveLoopback(proxy) {
  const o = _url.default.parse(proxy);

  o.host = undefined;

  if (o.hostname !== 'localhost') {
    return proxy;
  } // Unfortunately, many languages (unlike node) do not yet support IPv6.
  // This means even though localhost resolves to ::1, the application
  // must fall back to IPv4 (on 127.0.0.1).
  // We can re-enable this in a few years.

  /*try {
    o.hostname = address.ipv6() ? '::1' : '127.0.0.1';
  } catch (_ignored) {
    o.hostname = '127.0.0.1';
  }*/


  try {
    // Check if we're on a network; if we are, chances are we can resolve
    // localhost. Otherwise, we can just be safe and assume localhost is
    // IPv4 for maximum compatibility.
    if (!_address.default.ip()) {
      o.hostname = '127.0.0.1';
    }
  } catch (_ignored) {
    o.hostname = '127.0.0.1';
  }

  return _url.default.format(o);
} // We need to provide a custom onError function for httpProxyMiddleware.
// It allows us to log custom error messages on the console.


function onProxyError(proxy) {
  return (err, req, res) => {
    const host = req.headers && req.headers.host;
    console.log(_chalk.default.red('Proxy error:') + ' Could not proxy request ' + _chalk.default.cyan(req.url) + ' from ' + _chalk.default.cyan(host) + ' to ' + _chalk.default.cyan(proxy) + '.');
    console.log('See https://nodejs.org/api/errors.html#errors_common_system_errors for more information (' + _chalk.default.cyan(err.code) + ').');
    console.log(); // And immediately send the proper error response to the client.
    // Otherwise, the request will eventually timeout with ERR_EMPTY_RESPONSE on the client side.

    if (res.writeHead && !res.headersSent) {
      res.writeHead(500);
    }

    res.end('Proxy error: Could not proxy request ' + req.url + ' from ' + host + ' to ' + proxy + ' (' + err.code + ').');
  };
}

module.exports = {
  createCompiler,
  prepareUrls
};