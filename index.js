/* npm */
var colors = require('colors');
var request = require('request').defaults({jar:false});

/* core */
var util = require('util');
var proc = require('child_process');
var EventEmitter = require('events').EventEmitter;

module.exports = SauceTunnel;

function SauceTunnel(user, key, identifier, tunneled, extraFlags) {
  EventEmitter.call(this);
  this.user = user;
  this.key = key;
  this.identifier = identifier || 'Tunnel'+new Date().getTime();
  this.tunneled = tunneled;
  this.baseUrl = ["https://", this.user, ':', this.key, '@saucelabs.com', '/rest/v1/', this.user].join("");
  this.extraFlags = extraFlags;
}

util.inherits(SauceTunnel, EventEmitter);

SauceTunnel.prototype.openTunnel = function(callback) {
  var me = this;
  var args = ["-jar", __dirname + "/vendor/Sauce-Connect.jar", this.user, this.key];
  if (this.identifier) {
    args.push("-i", this.identifier);
  }
  if (this.extraFlags) {
    args = args.concat(this.extraFlags);
  }
  this.proc = proc.spawn('java', args);
  var calledBack = false;

  this.proc.stdout.on('data', function(d) {
    var data = typeof d !== 'undefined' ? d.toString() : '';
    if (typeof data === 'string' && !data.match(/^\[-u,/g)) {
      me.emit('verbose:debug', data.replace(/[\n\r]/g, ''));
    }
    if (typeof data === 'string' && data.match(/Connected\! You may start your tests/)) {
      me.emit('verbose:ok', '=> Sauce Labs Tunnel established');
      if (!calledBack) {
        calledBack = true;
        callback(true);
      }
    }
  });

  this.proc.stderr.on('data', function(data) {
    me.emit('log:error', data.toString().replace(/[\n\r]/g, ''));
  });

  this.proc.on('exit', function(code) {
    me.emit('verbose:ok', 'Sauce Labs Tunnel disconnected ', code);
    if (!calledBack) {
      calledBack = true;
      callback(false);
    }
  });
};

SauceTunnel.prototype.getTunnels = function(callback) {
  request({
    url: this.baseUrl + '/tunnels',
    json: true
  }, function(err, resp, body) {
    callback(body);
  });
};

SauceTunnel.prototype.killTunnel = function(callback) {
  if (!this.tunneled) {
    return callback();
  }

  this.emit('verbose:debug', 'Trying to kill tunnel');
  request({
    method: "DELETE",
    url: this.baseUrl + "/tunnels/" + this.identifier,
    json: true
  }, function (err, resp, body) {
    if (!err) {
      this.emit('verbose:debug', 'Tunnel Closed');
    }
    else {
      this.emit('log:error', 'Error closing tunnel');
    }
    callback(err);
  }.bind(this));
};

SauceTunnel.prototype.start = function(callback) {
  var me = this;
  if (!this.tunneled) {
    return callback(true);
  }
  this.emit('verbose:writeln', "=> Sauce Labs trying to open tunnel".inverse);
  this.openTunnel(function(status) {
    callback(status);
  });
};

SauceTunnel.prototype.stop = function(callback) {
  if (this.proc) {
    this.proc.kill();
  }
  this.killTunnel(function(err) {
    callback(err);
  });
};
