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

Queue.add = function(message) {
  return Queue.get(message.queue, function(err, queue) {
    if (queue != null) {
      return queue.update({
        queued: queue.queued + 1
      }, function(err, queue) {
        return pin.emit('LOG-INFO', {
          type: 'INFO',
          msg: 'added item to queue',
          msg: queue
        });
      });
    } else {
      return Queue.create({
        _id: message.queue,
        queued: 1,
        dequeued: 0,
        completed: 0
      }, function(err, queue) {
        return pin.emit('LOG-INFO', {
          type: 'INFO',
          msg: 'created queue',
          data: queue
        });
      });
    }
  });
};

Queue.dequeue = function(message) {
  return Queue.get(message.queue, function(err, queue) {
    if (queue != null) {
      return queue.update({
        queued: queue.queued - 1,
        dequeued: queue.dequeued + 1
      }, function(err, queue) {
        return pin.emit('LOG-INFO', {
          type: 'INFO',
          msg: 'dequeued item',
          data: queue
        });
      });
    }
  });
};

Queue.complete = function(message) {
  return Queue.get(message.queue, function(err, queue) {
    if (queue != null) {
      return queue.update({
        dequeued: queue.queued - 1,
        completed: queue.completed + 1
      }, function(err, queue) {
        return pin.emit('LOG-INFO', {
          type: 'INFO',
          msg: 'dequeued item',
          data: queue
        });
      });
    }
  });
};
