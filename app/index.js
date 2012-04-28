var Message, Queue, errmsg, pin;

pin = require('linchpin');

Message = require('./message');

Queue = require('./queue');

errmsg = function(msg) {
  return {
    success: false,
    message: msg
  };
};

pin.on('GET', function(req, res) {
  return Queue.all(function(err, queues) {
    if (err != null) {
      return res.json(errmsg(err.message), 500);
    } else {
      return res.json(queues);
    }
  });
});

pin.on('POST/*', function(req, res) {
  return Message.build(req.resource, req.params, function(err, message) {
    if (err != null) return res.json(errmsg(err.message), 500);
    return Queue.add(message, function(err, queue) {
      if (err != null) {
        return res.json(errmsg(err.message));
      } else {
        return res.json(message, 201);
      }
    });
  });
});

pin.on('GET/*', function(req, res) {
  return Message.dequeue(req.resource, function(err, message) {
    if (err != null) {
      return res.json({
        queue: 'empty'
      });
    } else {
      return Queue.dequeue(message.queue, function(err, queue) {
        if (err != null) return errmsg(err.message);
        return res.json(message);
      });
    }
  });
});

pin.on('PUT/*/*', function(req, res) {
  return Message.complete(req.resource, req.resourceId, function(err, message) {
    if (err != null) return error(err.message);
    return Queue.complete(message, function(err, queue) {
      if (err != null) return errmsg(err.message);
      return res.json(message, 201);
    });
  });
});

pin.on('DELETE/*/*', function(req, res) {
  return Message.remove(req.resource, req.resourceId, function(err, message) {
    if (err != null) return error(error.message);
    return res.json({
      success: true
    });
  });
});
