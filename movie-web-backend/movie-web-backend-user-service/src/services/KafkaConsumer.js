const { Kafka } = require('kafkajs');
const {
    errors
} = require('../ResponseStruct/ErrorCode')
const dotenv = require('dotenv');
const {
    KafkaLog
} = require('../config/Log');
dotenv.config();
const {
    sendMail
} = require('../services/MailServices');
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`]
})

const Consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP
})

const callback = async(topic, partition, message) => {
    const {
        msg, email
    } = JSON.parse(message.value.toString());
    await sendMail({
        msg: msg,
        email: email
    })
};

const connection = async() => {
    try {
        await Consumer.connect();
        console.log('Connected to Kakfa Success');
        await Consumer.subscribe({
            topic: process.env.KAFKA_TOPIC,
            fromBeginning: true
        })
        await Consumer.run({
            eachMessage: async({ topic, partition , message }) => {
                callback(topic, partition, message);
            }
        })
        Consumer.on('consumer.group_join', (event) => {
            KafkaLog.write(`${event}\n`)
        })
    } catch(err){
        throw errors.KAFKA_CONSUMER_ERROR.getError();
    }
}

connection();