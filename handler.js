'use strict';
const axios = require('axios');

module.exports.webhook = (event, context, callback) => {
  if (event.method === 'GET') {
    if (event.query['hub.verify_token'] === 'STRONGTOKEN' && event.query['hub.challenge']) {
      return callback(null, parseInt(event.query['hub.challenge']));
    }
    else {
      return callback('Invalid token');
    }
  }

  if (event.method === 'POST') {

    post(event)
      .then(console.log('Success'))
      .catch(console.error('Error!!'));
  }
};


let post = async event => {
  const accessToken = '<accessToken>';

  const url = `https://graph.facebook.com/v3.3/me/messages?access_token=${accessToken}`;

  let entry = event.body.entry[0];

  let messagingItem = entry.messaging[0];

  let markSeenPayload = {
    recipient: {
      id: messagingItem.sender.id
    },
    "sender_action": "mark_seen"
  };

  let tagsUrl = 'Our Graphql Endpoint';
  const tagsResponse = await axios.post(tagsUrl);
  let tags = [];
  await tagsResponse.data.data.popularTags.edges.forEach(element => {
    tags.push(element.node.name);
    tags.push(element.node.reactionDefaultSticker.images.fixed_width_and_height_downsampled.png.url);
  });

  let searchPayload = {
    recipient: {
      id: messagingItem.sender.id
    },
    "messaging_type": "RESPONSE",
    "message": {
      "text": "OK. Just tell me what you want to search for. You can also choose one of the most common tags.",
      "quick_replies": [{
        "content_type": "text",
        "title": `#${tags[0]}`,
        "payload": tags[0].replace('#', ''),
        "image_url": tags[1]
      }, {
        "content_type": "text",
        "title": `#${tags[2]}`,
        "payload": tags[2].replace('#', ''),
        "image_url": tags[3]
      },
      {
        "content_type": "text",
        "title": `#${tags[4]}`,
        "payload": tags[4].replace('#', ''),
        "image_url": tags[5]
      }
      ]
    }
  };

  let startPayload = {
    recipient: {
      id: messagingItem.sender.id
    },
    "messaging_type": "RESPONSE",
    "message": {
      "text": "Hi I\'m MojiLaLa Bot. Just tell me what you want to search for. You can also choose one of the most common tags.",
      "quick_replies": [{
        "content_type": "text",
        "title": `#${tags[0]}`,
        "payload": tags[0],
        "image_url": tags[1]
      }, {
        "content_type": "text",
        "title": `#${tags[2]}`,
        "payload": tags[2],
        "image_url": tags[3]
      },
      {
        "content_type": "text",
        "title": `#${tags[4]}`,
        "payload": tags[4],
        "image_url": tags[5]
      }
      ]
    }
  };

  await axios.post(url, markSeenPayload).then((response) => { });

  if (!messagingItem.postback) {

    if (!messagingItem.message) {
      return {
        statusCode: 200,
        body: {}
      };

    }

    if (!messagingItem.message.text) {
      return {
        statusCode: 200,
        body: {}
      };
    }

    await sendResults(messagingItem.sender.id, messagingItem.message.text, url);
  }
  else {

    if (messagingItem.postback.payload === "Search") {
      await axios.post(url, searchPayload).then((response) => { });
    }
    else if (messagingItem.postback.payload === "Start") {
      await axios.post(url, startPayload).then((response) => { });
    }
    else {
      await sendResults(messagingItem.sender.id, messagingItem.postback.payload, url);
    }
  }
};

let sendResults = async (id, text, url) => {
  text = text.replace('#', '');
  let noResultPayload = {
    recipient: {
      id: id
    },
    message: {
      text: 'Sorry, I couldn\'t find anyting for you please search again...'
    }
  };
  const grapqlURL = `Our Graphql Endpoint`;

  let stickers = [];

  await axios.post(grapqlURL)
    .then(response => {
      if (response.data.data.stickers)
        response.data.data.stickers.edges.forEach(element => {
          stickers.push(element.node.fileUrl);
        });
    });

  if (stickers.length === 0) {
    await axios.post(url, noResultPayload).then((response) => { });
  }
  else {
    let elements = [];
    await stickers.forEach(sticker_url => {
      elements.push({
        "title": "MojiLaLa",
        "image_url": sticker_url,
        "buttons": [
          //   {
          //   "type": "web_url",
          //   "url": "https://extension-messenger-v2.mojilala.com/",
          //   "title": "View More"
          // },
          {
            "type": "web_url",
            "url": "https://unlimited.app.link",
            "title": "Get Stickers"
          }
        ]
      });
    });

    let resultPayload = {
      "recipient": {
        "id": id
      },
      "message": {
        "attachment": {
          "type": "template",
          payload: {
            "image_aspect_ratio": "square",
            "sharable": true,
            "template_type": "generic",
            "elements": elements
          }
        }
      }
    };
    await axios.post(url, resultPayload).then((response) => { });
    return {
      statusCode: 200,
      body: "{}"
    };
  }
};