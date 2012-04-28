var Message, nconf, pin, resourceful;

resourceful = require('resourceful');

nconf = require('nconf');

pin = require('linchpin');

nconf.env().file({
  file: "" + __dirname + "/../config.json"
});

module.exports = Message = resourceful.define('message', function() {
  this.use('couchdb', nconf.get("couchdb"));
  this.string('queue');
  this.string('body');
  this.string('expire');
  this.string('status');
  return this.timestamps();
});

Message.queues = function(cb) {
  return Message.all(function(err, messages) {
    var message, results, _i, _len;
    results = [
      {
        queue: 'meme',
        status: 'queued',
        count: 0
      }
    ];
    for (_i = 0, _len = messages.length; _i < _len; _i++) {
      message = messages[_i];
      console.log(results[0]);
      results[0].count += 1;
    }
    console.log(results);
    return cb(null, results);
  });
};

Message.build = function(queue, data, cb) {
  data.queue = queue;
  data.status = 'queued';
  return Message.create(data, cb);
};

Message.dequeue = function(queue, cb) {
  return Message.find({
    queue: queue,
    status: 'queued'
  }, function(err, messages) {
    if (messages.length === 0) return cb(new Error('empty'), null);
    messages[0].status = 'dequeued';
    return messages[0].update({
      status: 'dequeued'
    }, function(err, result) {
      return cb(null, messages[0]);
    });
  });
};

Message.complete = function(queue, id, cb) {
  return Message.get(id, function(err, message) {
    message.status = 'completed';
    return message.update({
      status: 'completed'
    }, function(err, result) {
      return cb(null, message);
    });
  });
};

Message.remove = function(queue, id, cb) {
  return Message.destroy(id, cb);
};

pin.on('cloudq.insert', function(data) {
  return Message.create(data, function(err, message) {
    return console.log(message);
  });
});
