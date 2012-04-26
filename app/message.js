var Message, pin, resourceful;

resourceful = require('resourceful');

pin = require('linchpin');

module.exports = Message = resourceful.define('message', function() {
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

Message.build = function(data, cb) {
  data.status = 'queued';
  return Message.create(data, cb);
};

Message.dequeue = function(queue, cb) {
  return Message.find({
    queue: queue
  }, function(err, messages) {
    return messages[0].update({
      status: 'dequeued'
    }, cb);
  });
};

Message.complete = function(queue, id, cb) {
  return Message.get(id, function(err, message) {
    return message.update({
      status: 'completed'
    }, cb);
  });
};

pin.on('cloudq.insert', function(data) {
  return Message.create(data, function(err, message) {
    return console.log(message);
  });
});
