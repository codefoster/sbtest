import { ServiceBusClient, SendableMessageInfo } from "@azure/service-bus";

// Define connection string and related Service Bus entity names here
const connectionString = "Endpoint=sb://exrxsb.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=kppcYvwJEC5XoJeHPzKBYbxrOeb6zxccU6tpqFrWRAU=";
const topicName = "messages";

const listOfScientists = [
    { name: "Einstein", firstName: "Albert" },
    { name: "Heisenberg", firstName: "Werner" },
    { name: "Curie", firstName: "Marie" },
    { name: "Hawking", firstName: "Steven" },
    { name: "Newton", firstName: "Isaac" },
    { name: "Bohr", firstName: "Niels" },
    { name: "Faraday", firstName: "Michael" },
    { name: "Galilei", firstName: "Galileo" },
    { name: "Kepler", firstName: "Johannes" },
    { name: "Kopernikus", firstName: "Nikolaus" }
];

async function main(): Promise<void> {
    const sbClient = ServiceBusClient.createFromConnectionString(connectionString);

    const topicClient = sbClient.createTopicClient(topicName);
    const sender = topicClient.createSender();

    try {
        for (let index = 0; index < listOfScientists.length; index++) {
            const scientist = listOfScientists[index];
            const message: SendableMessageInfo = {
                body: `${scientist.firstName} ${scientist.name}`,
                label: "Scientist"
            };

            console.log(`Sending message: ${message.body} - ${message.label}`);
            await sender.send(message);
        }

        await topicClient.close();
    } finally {
        await sbClient.close();
    }
}

main().catch((err) => {
    console.log("Error occurred: ", err);
});