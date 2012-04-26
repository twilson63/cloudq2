request = require 'request'
server = require '../'
pin = require 'linchpin'

url = 'http://localhost:3000'

describe 'cloudq-index', ->
  describe 'success with no data', ->
    it 'GET /', (done) ->
      request url, (err, res) ->
        res.statusCode.should.equal 500
        done()
  describe 'success with no data', ->
    it 'GET /', (done) ->
      request url, json: true, (err, res, body) ->
        body.length.should.equal 0
        done()
  describe 'success with data', ->
    body = {}
    before (done) ->
      pin.emit 'cloudq.insert', queue: 'meme', body: 'Meme Foo Bar', expire: '1d'
      pin.emit 'cloudq.insert', queue: 'meme', body: 'Meme Foo Bar2', expire: '1d'    
      request url, json: true, (err, res, b) ->
        body = b
        done()
    it 'GET /', (done) ->
        console.log body
        done()
