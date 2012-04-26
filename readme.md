# Cloudq

## API

``` sh
GET / 
Content-Type: JSON
Content-Length: 0
```

Returns list of queues

```
[
{ name: 'meme', status: 'queued', count: 4}, #red
{ name: 'meme', status: 'working', count: 3}, # yellow/orange
{ name: 'meme', status: 'done', count: 5}, # green
{ name: 'meme', status: 'expired', count: 5}  # grey
]
```

---

POST /:queue
Content-Type: application/json
Content:
{"queue":"meme", "body": "Foo Bar", "expire": "1d"}

---

GET /:queue
Content-Type: application/json

Returns 

{"queue":"meme", "body": "Foo Bar", "expire": "1d", "id": 1}

---

DELETE /:queue/:id
Content-Type: application/json

{ success: true }

---

GET /:queue/:id

{"queue":"meme", "body": "Foo Bar", "expire": "1d", "id": 1, "status": "working"}

