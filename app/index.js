var Message, Queue, pin;

pin = require('linchpin');

Message = require('./message');

Queue = require('./queue');

pin.on('GET', function(req, res) {
  if (req.headers['content-type'] !== 'application/json') {
    res.writeHead(500, {
      'content-type': 'application/json'
    });
    res.end('Application/JSON is only supported');
    return;
  }
  return Queue.all(function(err, queues) {
    res.writeHead(200, {
      'content-type': 'application/json'
    });
    return res.end(JSON.stringify(queues));
  });
});

pin.on('POST/*', function(req, res) {
  req.params.queue = req.resource;
  return Message.create(req.params, function(err, message) {
    Queue.add(message);
    res.writeHead(200, {
      'content-type': 'application/json'
    });
    return res.end(JSON.stringify(message));
  });
});

pin.on('GET/*', function(req, res) {
  return Message.dequeue(req.resource, function(err, message) {
    Queue.dequeue(message);
    res.writeHead(200, {
      'content-type': 'application/json'
    });
    return res.end(JSON.stringify(message));
  });
});

pin.on('DELETE/*/*', function(req, res) {
  return Message.complete(req.resource, req.resourceId, function(err, message) {
    Queue.complete(message);
    res.writeHead(200, {
      'content-type': 'application/json'
    });
    return res.end(JSON.stringify(message));
  });
});
