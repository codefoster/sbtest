import { ServiceBusClient } from "@azure/service-bus";

const connectionString = "Endpoint=sb://exrxsb.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=kppcYvwJEC5XoJeHPzKBYbxrOeb6zxccU6tpqFrWRAU=";
const topicName = "messages";
const sbClient = ServiceBusClient.createFromConnectionString(connectionString);
const topicClient = sbClient.createTopicClient(topicName);
const sender = topicClient.createSender();

let i = 0;
setInterval(() => {
    let messageId = i + 1;
    let carId = (i % 50) + 1;

    sender.send({
        sessionId: `${carId}`,
        userProperties: {
            carId: carId
        },
        body: {
            createTimestamp: Date.now(),
            messageId: messageId
        }
    });
    console.log(`Sending message ${messageId} (car ${carId})`);
    i++;
}, 2)