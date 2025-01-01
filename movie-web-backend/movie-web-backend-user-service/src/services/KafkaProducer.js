const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');
const {
    errors
} = require('../ResponseStruct/ErrorCode')
dotenv.config();
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`]
})

const Producer = kafka.producer();

var that = module.exports = {
    KafkaProducer : async({
        msg = null,
        email = null
    }) => {
        await Producer.connect();
        try {
            
            console.log('Kafka Consummer Connection Success');
            await Producer.send({
                topic: process.env.KAFKA_TOPIC,
                messages: [
                    { 
                        value: JSON.stringify({
                        msg: msg,
                        email: email
                    })}
                ]
            })
            
        } catch(err) {
            throw errors.KAFKA_PRODUCER_ERROR.getError();
        }
        await Producer.disconnect();
        return 1;

    }
}