/**
 * @fileOverview
 * Reduced set of ColorJizz library.
 * https://github.com/mikeemoo/ColorJizz-PHP
 */

Contextly.color = Contextly.color || {};

Contextly.color.RGB = Contextly.createClass({

  construct: function() {
    if (arguments.length === 1) {
      var input = arguments[0];
      var matches = input.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/);
      if (!matches) {
        Contextly.Utils.error('Unable to parse color ' + input);
      }

      this.red = parseInt(matches[1], 16);
      this.green = parseInt(matches[2], 16);
      this.blue = parseInt(matches[3], 16);
    }
    else if (arguments.length === 3) {
      this.red = arguments[0];
      this.green = arguments[1];
      this.blue = arguments[2];
    }
    else {
      Contextly.Utils.error('Wrong number of arguments passed to the RGB color constructor.');
    }
  },

  toHSV: function() {
    var red = this.red / 255;
    var green = this.green / 255;
    var blue = this.blue / 255;

    var min = Math.min(red, green, blue);
    var max = Math.max(red, green, blue);

    var value = max;
    var delta = max - min;

    if (delta == 0) {
      return new Contextly.color.HSV(0, 0, value * 100);
    }

    var hue, saturation = 0;

    if (max != 0) {
      saturation = delta / max;
    }
    else {
      saturation = 0;
      hue = -1;
      return new Contextly.color.HSV(hue, saturation, value);
    }

    if (red == max) {
      hue = (green - blue) / delta;
    }
    else {
      if (green == max) {
        hue = 2 + (blue - red) / delta;
      }
      else {
        hue = 4 + (red - green) / delta;
      }
    }
    hue *= 60;
    if (hue < 0) {
      hue += 360;
    }

    return new Contextly.color.HSV(hue, saturation * 100, value * 100);
  },

  toString: function() {
    var output = '#';

    var pad = '00';
    var colors = [this.red, this.green, this.blue];
    for (var i = 0; i < colors.length; i++) {
      var color = Math.round(colors[i]);
      color = color.toString(16);
      color = pad.substr(0, pad.length - color.length) + color;
      output += color;
    }

    return output;
  }

});

Contextly.color.HSV = Contextly.createClass({

  construct: function(h, s, v) {
    this.h = h;
    this.s = s;
    this.v = v;
  },

  brightness: function(updates) {
    var v = this.v;
    var min = updates.min || 0;
    var max = updates.max || 100;

    if (typeof updates.delta !== 'undefined') {
      v = Math.max(Math.min(v + updates.delta, max), min);
    }

    return new Contextly.color.HSV(this.h, this.s, v);
  },

  toRGB: function() {
    var R, G, B;

    var h = this.h / 360;
    var s = this.s / 100;
    var v = this.v / 100;

    if (s == 0) {
      R = v * 255;
      G = v * 255;
      B = v * 255;
    }
    else {
      var var_h = h * 6;
      if (var_h == 6) {
        var_h = 0;
      }
      var var_i = Math.floor(var_h);
      var var_1 = v * (1 - s);
      var var_2 = v * (1 - s * (var_h - var_i));
      var var_3 = v * (1 - s * (1 - (var_h - var_i)));

      var var_r, var_g, var_b;
      if (var_i == 0) {
        var_r = v;
        var_g = var_3;
        var_b = var_1
      }
      else if (var_i == 1) {
        var_r = var_2;
        var_g = v;
        var_b = var_1
      }
      else if (var_i == 2) {
        var_r = var_1;
        var_g = v;
        var_b = var_3
      }
      else if (var_i == 3) {
        var_r = var_1;
        var_g = var_2;
        var_b = v
      }
      else if (var_i == 4) {
        var_r = var_3;
        var_g = var_1;
        var_b = v
      }
      else {
        var_r = v;
        var_g = var_1;
        var_b = var_2
      }

      R = var_r * 255;
      G = var_g * 255;
      B = var_b * 255;
    }

    return new Contextly.color.RGB(R, G, B);
  }

});
