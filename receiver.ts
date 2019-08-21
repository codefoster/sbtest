import { ServiceBusClient, ReceiveMode, SubscriptionClient } from "@azure/service-bus";
import commandLineArgs = require('command-line-args');

const config = commandLineArgs([
  { name: 'car', alias: 'c' }
]);
const connectionString = "Endpoint=sb://exrxsb.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=kppcYvwJEC5XoJeHPzKBYbxrOeb6zxccU6tpqFrWRAU=";
const topicName = "messages";
const carId = config["car"];
const subscription = `car${config["car"]}`;
ServiceBusClient
  .createFromConnectionString(connectionString)
  .createSubscriptionClient(topicName, subscription)
  .createReceiver(ReceiveMode.receiveAndDelete, { sessionId: `${carId}` })
  .registerMessageHandler(
    async (msg) => {
      console.log(`completed message ${msg.body.messageId} {latency: ${Date.now() - msg.body.createTimestamp}ms}`);
    },
    err => { }
  );