//window.SERVER = 'http://localhost:60000';
//window.CLIENTS = 'http://localhost/stepdaddy';
/**
 * The museq namespace
 * @type {Object}
 */
var museq = museq || {};

/**
 * The audio namespace
 * @type {Object}
 */
museq.audio = museq.audio || {};

/**
 * The views namespace
 * @type {Object}
 */
museq.views = museq.views || {};

/**
 * The controllers namespace
 * @type {Object}
 */
museq.controllers = museq.controllers || {};

/**
 * The commands namespace
 * @type {Object}
 */
museq.commands = museq.commands || {};

/**
 * The models namespace
 * @type {Object}
 */
museq.models = museq.models || {};

/**
 * The net namespace
 * @type {Object}
 */
museq.net = museq.net || {};

/**
 * The mixins namespace
 * @type {Object}
 */
museq.mixins = museq.mixins || {};

/**
 * The enum namespace
 * @type {Object}
 */
museq.enums = museq.enums || {};

/**
 * The ui namespace
 * @type {Object}
 */
museq.ui = museq.ui || {};

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
        window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());
