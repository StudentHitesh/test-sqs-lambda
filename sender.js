const AWS = require('aws-sdk');
const sqs = new AWS.SQS({
    region: 'us-east-1'
});

module.exports.default = async (event, context) => {

    console.log(`+senderEvent: ${JSON.stringify(event)}`);

    console.log(`body: ${JSON.stringify(event.body)}`);

    const { message, queueUrl} = JSON.parse(event.body);

    console.log(`message: ${message} queueUrl: ${queueUrl}`);
    var responseBody = {
        message: ''
    };

    var params = {
        MessageBody: message,
        QueueUrl: queueUrl,
        DelaySeconds: 5
    };

    await sqs.sendMessage(params, function (err, data) {
        console.log(`sqs calling...`);
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
        console.log(response);
    }).promise();
}