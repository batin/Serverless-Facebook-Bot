# Serverless-Facebook-Bot
---
AWS Serverless Facebook Bot

Used for: https://gitlab.com/mojilala/extension-v2
You Can Speak with the bot from: https://www.facebook.com/leostickersapp

### How To Deploy 
```
serverless deploy

```

### Persistent menu
``` 
curl -X POST -H "Content-Type: application/json" -d '{
    persistent_menu: [{
      "locale": "default",
      "composer_input_disabled": false,
      "call_to_actions":[
      {
        "type": "postback",
        "title": "🔎 Search Sticker",
        "payload": "Search"
      },
      {
        "type": "postback",
        "title": "⚡️ Restart Bot",
        "payload": "Start"
      },
      {
        "type": "web_url",
        "title": "❤️ Download MojiLaLa App ❤️",
        "url": "https://unlimited.app.link",
        "webview_height_ratio": "full"
      }]
  }]
}' "https://graph.facebook.com/v3.3/me/messenger_profile?access_token=<access_token>"

```



### Home url
```
curl -X POST -H "Content-Type: application/json" -d '{
"home_url": {
  "url": "https://extension-messenger-v2.mojilala.com",
    "webview_height_ratio": "tall",
      "webview_share_button": "show",
        "in_test": true
}
}' "https://graph.facebook.com/v3.3/me/messenger_profile?access_token=<access_token>"

```


### Whitelisted domains
```
curl -X POST -H "Content-Type: application/json" -d '{
  "whitelisted_domains": [
    "https://extension-messenger-v2.mojilala.com",
  ]
}' "https://graph.facebook.com/v3.3/me/messenger_profile?access_token=<access_token>"

```


### Get started
```
curl -X POST -H "Content-Type: application/json" -d '{
"get_started": {
  "payload": "Start"
}
}' "https://graph.facebook.com/v3.3/me/messenger_profile?access_token=<access_token>"

```