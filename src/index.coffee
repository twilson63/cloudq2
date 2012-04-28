pin = require 'linchpin'
Message = require './message'
Queue = require './queue'

errmsg = (msg) -> { success: false, message: msg }

# GET / -> queues
pin.on 'GET', (req, res) -> Queue.all (err, queues) -> 
  if err?
    res.json errmsg(err.message), 500
  else
    res.json queues

# POST / -> queue
pin.on 'POST/*', (req, res) ->
  Message.build req.resource, req.params, (err, message) -> 
    return res.json errmsg(err.message), 500 if err?
    Queue.add message, (err, queue) -> 
      if err?
        res.json errmsg(err.message) 
      else
        res.json message, 201

pin.on 'GET/*', (req, res) ->
  Message.dequeue req.resource, (err, message) ->
    if err? 
      return res.json queue: 'empty'
    else
      Queue.dequeue message.queue, (err, queue) -> 
        return errmsg(err.message) if err? 
        res.json message

pin.on 'PUT/*/*', (req, res) ->
  Message.complete req.resource, req.resourceId, (err, message) ->
    return error(err.message) if err? 
    Queue.complete message, (err, queue) -> 
      return errmsg(err.message) if err? 
      res.json message, 201

pin.on 'DELETE/*/*', (req, res) ->
  Message.remove req.resource, req.resourceId, (err, message) ->
    # Queue.complete message, (err, queue) -> 
    return error(error.message) if err? 
    res.json success: true