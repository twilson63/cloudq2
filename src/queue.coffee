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

Queue.add = (message, cb) ->
  Queue.get message.queue, (err, queue) ->
    if queue?
      queue.update queued: queue.queued + 1, (err, queue) ->
        pin.emit 'LOG', { type: 'INFO', msg: 'added item to queue', msg: queue }
        cb(err, queue)
    else
      Queue.create _id: message.queue, queued: 1, dequeued: 0, completed: 0, (err, queue) ->
        pin.emit 'LOG', { type: 'INFO', msg: 'created queue', data: queue }
        cb(err, queue)

Queue.dequeue = (name, cb) ->
  Queue.get name, (err, queue) ->
    if err?
      cb(err, queue)
    else
      queue.update queued: queue.queued - 1, dequeued: queue.dequeued + 1, (err, result) ->
        pin.emit 'LOG', { type: 'INFO', msg: 'dequeued item', data: queue }
        cb(err, queue)

Queue.complete = (message, cb) ->
  Queue.get message.queue, (err, queue) ->
    if queue?
      queue.update dequeued: queue.queued - 1, completed: queue.completed + 1, (err, queue) ->
        pin.emit 'LOG', { type: 'INFO', msg: 'dequeued item', data: queue }
        cb(err, queue)