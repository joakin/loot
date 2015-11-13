loot
====

A simple Node.js service that aggressively transforms RESTBase content for
consumption by lightweight web apps.

## Endpoints

### Api

* `/slim/[title]`
* `/slim/lead/[title]`

### Response

The `/slim/[title]` and `/slim/lead/[title]` endpoints respond with JSON in the following form:

```json
{
  "sections": [
    {
      "title": "",
      "content": "<p>This is the lead section</p>"
    },
    {
      "title": "First section",
      "content": "<p>This is the first section</p>"
    }
  ]
}
```

## Dev

* `npm install` to get the dependencies.
* `npm start` to run the server in development.

