var request = require('request'),
  assert = require('assert'),
  fs = require('fs');

var cloudq = require('../server');


var url = 'http://localhost:3000/'

counter = 0

function end () {
  counter--
  if (counter === 0) cloudq.httpServer.close()
}

// queue message
counter++
request.post({url: url + "/foo", json: {body: "I am a message"}, expire: '1d'}, function (e, resp, body) {
  if (e) throw e
  if (resp.statusCode !== 200) throw new Error('status code is not 200. '+resp.statusCode)
  assert.equal(resp.headers['content-type'], 'application/json')
  console.log(body)
  //assert.equal(typeof(body), 'object')
  console.log('Passed json /')
  end()
})

// counter++
// request({url:url, json: true}, function (e, resp, body) {
//   if (e) throw e
//   if (resp.statusCode !== 200) throw new Error('status code is not 200. '+resp.statusCode)
//   assert.equal(resp.headers['content-type'], 'application/json')
//   assert.equal(typeof(body), 'object')
//   console.log('Passed json /')
//   end()
// })

