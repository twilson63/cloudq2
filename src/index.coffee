pin = require 'linchpin'

Message = require './message'
Queue = require './queue'

pin.on 'GET', (req, res) ->
  unless req.headers['content-type'] is 'application/json'
    res.writeHead 500, 'content-type': 'application/json'
    res.end 'Application/JSON is only supported' 
    return

  Queue.all (err, queues) ->
    res.writeHead 200, 'content-type': 'application/json'
    res.end JSON.stringify(queues)

pin.on 'POST/*', (req, res) ->
  req.params.queue = req.resource
  Message.create req.params, (err, message) ->
    Queue.add(message)
    res.writeHead 200, 'content-type': 'application/json'
    res.end JSON.stringify(message)

pin.on 'GET/*', (req, res) ->
  Message.dequeue req.resource, (err, message) ->
    Queue.dequeue(message)
    res.writeHead 200, 'content-type': 'application/json'
    res.end JSON.stringify(message)

pin.on 'DELETE/*/*', (req, res) ->
  Message.complete req.resource, req.resourceId, (err, message) ->
    Queue.complete(message)
    res.writeHead 200, 'content-type': 'application/json'
    res.end JSON.stringify(message)
  