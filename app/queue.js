var Queue, nconf, pin, resourceful;

resourceful = require('resourceful');

nconf = require('nconf');

pin = require('linchpin');

nconf.env().file({
  file: "" + __dirname + "/../config.json"
});

module.exports = Queue = resourceful.define('queue', function() {
  this.use('couchdb', nconf.get("couchdb"));
  this.string('name');
  this.number('queued');
  this.number('dequeued');
  this.number('completed');
  return this.timestamps();
});

Queue.add = function(message, cb) {
  return Queue.get(message.queue, function(err, queue) {
    if (queue != null) {
      return queue.update({
        queued: queue.queued + 1
      }, function(err, queue) {
        pin.emit('LOG', {
          type: 'INFO',
          msg: 'added item to queue',
          msg: queue
        });
        return cb(err, queue);
      });
    } else {
      return Queue.create({
        _id: message.queue,
        queued: 1,
        dequeued: 0,
        completed: 0
      }, function(err, queue) {
        pin.emit('LOG', {
          type: 'INFO',
          msg: 'created queue',
          data: queue
        });
        return cb(err, queue);
      });
    }
  });
};

Queue.dequeue = function(name, cb) {
  return Queue.get(name, function(err, queue) {
    if (err != null) {
      return cb(err, queue);
    } else {
      return queue.update({
        queued: queue.queued - 1,
        dequeued: queue.dequeued + 1
      }, function(err, result) {
        pin.emit('LOG', {
          type: 'INFO',
          msg: 'dequeued item',
          data: queue
        });
        return cb(err, queue);
      });
    }
  });
};

Queue.complete = function(message, cb) {
  return Queue.get(message.queue, function(err, queue) {
    if (queue != null) {
      return queue.update({
        dequeued: queue.queued - 1,
        completed: queue.completed + 1
      }, function(err, queue) {
        pin.emit('LOG', {
          type: 'INFO',
          msg: 'dequeued item',
          data: queue
        });
        return cb(err, queue);
      });
    }
  });
};
