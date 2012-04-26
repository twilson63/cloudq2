resourceful = require 'resourceful'
nconf = require 'nconf'
pin = require 'linchpin'

nconf.env().file file: "#{__dirname}/../config.json"

module.exports = Queue = resourceful.define 'queue', ->
  @use 'couchdb', nconf.get "couchdb"
  @string 'name'
  @number 'queued'
  @number 'dequeued'
  @number 'completed'
  @timestamps()

Queue.add = (message) ->
  Queue.get message.queue, (err, queue) ->
    if queue?
      queue.update queued: queue.queued + 1, (err, queue) ->
        pin.emit 'LOG-INFO', { type: 'INFO', msg: 'added item to queue', msg: queue }
    else
      Queue.create _id: message.queue, queued: 1, dequeued: 0, completed: 0, (err, queue) ->
        pin.emit 'LOG-INFO', { type: 'INFO', msg: 'created queue', data: queue }

Queue.dequeue = (message) ->
  Queue.get message.queue, (err, queue) ->
    if queue?
      queue.update queued: queue.queued - 1, dequeued: queue.dequeued + 1, (err, queue) ->
        pin.emit 'LOG-INFO', { type: 'INFO', msg: 'dequeued item', data: queue }

Queue.complete = (message) ->
  Queue.get message.queue, (err, queue) ->
    if queue?
      queue.update dequeued: queue.queued - 1, completed: queue.completed + 1, (err, queue) ->
        pin.emit 'LOG-INFO', { type: 'INFO', msg: 'dequeued item', data: queue }
