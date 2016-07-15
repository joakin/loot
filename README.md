loot
====

A simple Node.js service that aggressively transforms RESTBase content for
consumption by lightweight web apps.

![](https://img.shields.io/badge/status-frozen-blue.png)

## Frozen/Deprecated

This server is not used any more, refer to the following links to an open
source more production ready service:

* https://en.wikipedia.org/api/rest_v1/?doc
* https://github.com/wikimedia/mediawiki-services-mobileapps

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

