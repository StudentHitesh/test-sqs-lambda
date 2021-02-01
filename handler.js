const AWS = require("aws-sdk");
const _ = require("lodash");

const sqs = new AWS.SQS({
  region: 'us-east-1'
});

const handlerMap = {
  sender: sender,
  receiver: receiver
};

async function sender(event, context, callback) {

  console.log(`+senderEvent: ${JSON.stringify(event)}`);

  let queueUrl = event.queueUrl;

  var responseBody = {
    message: ''
  };
  // SQS message parameters
  var params = {
    MessageBody: event.body,
    QueueUrl: queueUrl
  };


  sqs.sendMessage(params, function (err, data) {
    if (err) {
      console.log('error:', "failed to send message" + err);
    } else {
      console.log('data:', data.MessageId);
      responseBody.message = 'Sent to ' + queueUrl;
      responseBody.messageId = data.MessageId;
    }
    var response = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(responseBody)
    };

    callback(null, response);
  });
}

function receiver(event, context, callback) {

  console.log(`+receiverEvent: ${JSON.stringify(event)}`);
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'SQS event processed.',
      input: event,
    }),
  };

  var body = event.Records[0].body;
  console.log("text: ", JSON.parse(body).text);

  callback(null, response);
}

module.exports.default = async (event, context, callback) => {

  console.log(`event: ${JSON.stringify(event)} context: ${JSON.stringify(context)}`);

  const action = event.action;
  const handler = _.get(handlerMap, action);
  handler(event, context, callback);

};
