resourceful = require 'resourceful'
nconf = require 'nconf'
pin = require 'linchpin'

nconf.env().file file: "#{__dirname}/../config.json"

module.exports = Message = resourceful.define 'message', ->
  @use 'couchdb', nconf.get "couchdb"
  @string 'queue'
  @string 'body'
  @string 'expire'
  @string 'status'
  @timestamps()

# todo: needs to aggregate by queue-status and count
Message.queues = (cb) -> 
  Message.all (err, messages) ->
    results = [{queue: 'meme', status: 'queued', count: 0}]
    for message in messages
      console.log results[0]
      results[0].count += 1
    console.log results
    cb null, results

Message.build = (data, cb) ->
  data.status = 'queued'
  Message.create data, cb

Message.dequeue = (queue, cb) ->
  Message.find {queue}, (err, messages) ->
    messages[0].update status: 'dequeued', cb

Message.complete = (queue, id, cb) ->
  Message.get id, (err, message) ->
    message.update status: 'completed', cb

pin.on 'cloudq.insert', (data) -> 
  Message.create data, (err, message) ->
    console.log message