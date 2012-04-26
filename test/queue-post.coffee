request = require 'request'
server = require '../'
pin = require 'linchpin'

url = 'http://localhost:3000/meme'

describe 'cloudq-queue', ->
  describe 'successful', ->
    it 'POST /meme', (done) ->
      request url, json: {body: 'Foo Bar3', expire: '1d'},  (err, res, body) ->
        console.log body
        #res.statusCode.should.equal 200
        done()
#   describe 'success', ->
#     it 'POST /meme', (done) ->
#       request url, json: true, (err, res, body) ->
#         body.length.should.equal 0
#         done()
#   describe 'success with data', ->
#     before (done) ->
#       pin.emit 'cloudq.insert', queue: 'meme', body: 'Meme Foo Bar', expire: '1d'
#       pin.emit 'cloudq.insert', queue: 'meme', body: 'Meme Foo Bar2', expire: '1d'    
#     it 'GET /', (done) ->
#       request url, json: true, (err, res, body) ->
#         body.length.should.equal 1
#         done()
