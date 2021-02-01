
module.exports.default = async (event, context, callback) => {

    console.log(`+receiverEvent: ${JSON.stringify(event)}`);
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'SQS event processed.',
            input: event,
        }),
    };

    var body = event.Records[0].body;
    console.log(body);

    callback(null, response);
}