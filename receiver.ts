import { OnMessage, OnError, delay, ServiceBusClient, ReceiveMode, SubscriptionClient } from "@azure/service-bus";

const connectionString = "Endpoint=sb://exrxsb.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=kppcYvwJEC5XoJeHPzKBYbxrOeb6zxccU6tpqFrWRAU=";
const topicName = "messages";
const subscriptionName = "subscription1"

async function main(): Promise<void> {
  const sbClient = ServiceBusClient.createFromConnectionString(connectionString);

  // If receiving from a Subscription, use `createSubscriptionClient` instead of `createQueueClient`
  const subscriptionClient = sbClient.createSubscriptionClient(topicName, subscriptionName);

  // To receive messages from sessions, use getSessionReceiver instead of getReceiver or look at
  // the sample in sessions.ts file
  const receiver = subscriptionClient.createReceiver(ReceiveMode.peekLock);

  const onMessageHandler: OnMessage = async (brokeredMessage) => {
    console.log(`Received message: ${brokeredMessage.body}`);
    await brokeredMessage.complete();
  };
  const onErrorHandler: OnError = (err) => {
    console.log("Error occurred: ", err);
  };

  try {
    receiver.registerMessageHandler(onMessageHandler, onErrorHandler, { autoComplete: false });

    // Waiting long enough before closing the receiver to receive messages
    await delay(5000);

    await receiver.close();
    await subscriptionClient.close();
  } finally {
    await sbClient.close();
  }
}

main().catch((err) => {
  console.log("Error occurred: ", err);
});