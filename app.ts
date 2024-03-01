import amqp from "amqplib/callback_api";

async function connect() {
    try {
        await amqp.connect(
            //Escuhando a:
            "amqp://34.224.23.35",
            (err: any, conn: amqp.Connection) => {
                if (err) throw new Error(err);
                conn.createChannel((errChanel: any, channel: amqp.Channel) => {
                    if (errChanel) throw new Error(errChanel);
                    channel.assertQueue();
                    channel.consume("payments", async (data: amqp.Message | null) => {
                        if (data?.content !== undefined) {
                            console.log(data.content);
                            const content = data?.content;
                            const parsedContent = JSON.parse(content.toString());
                            const headers = {
                                "Content-Type": "application/json",
                            };
                            const body = {
                                method: "POST",
                                headers,
                                body: JSON.stringify(parsedContent),
                            };
                            console.log(parsedContent);
                            //En donde esta realizando las peticiones POST
                            //Es decir, API 2
                            fetch("LINK", body)
                                .then(() => {
                                    console.log("datos enviados");
                                })
                                .catch((err: any) => {
                                    throw new Error(err);
                                }); 
                            await channel.ack(data);
                        }
                    });
                });
            }
        );
    } catch (err: any) {
        throw new Error(err);
    }
}

connect();