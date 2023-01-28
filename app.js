// Import all dependencies & middleware here
import express from 'express';
import bodyParser from 'body-parser';
import {
    topicController,
    userController,
} from './controller';
import mysql from "mysql";
import ws from "ws";
import events from "events";
// Init an Express App. This later starts a server and put all dependencies into your project to use
const app = express();
export const EventEmitter = new events.EventEmitter();
// Use your dependencies here

// use all controllers(APIs) here
app.use('/', userController);
app.use('/', topicController);
// Uncomment and modify the route if you want to use any controllers

const port =process.env.port || 1780

// Start Anything here
app.listen(port, () => {
    ConnectToMySQLDatabase();
    AuthTheServer();
    GetMessagesFromServer();
});

let utf8decoder = new TextDecoder();
// Use your dependencies here
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

export const connection = mysql.createConnection({
    host: '185.165.40.175',
    user: 'therondo_faraz',
    password: 'Faraz@1381',
    database: 'therondo_tinode'
})
export const client = new ws('ws://5.75.175.196:6060/v0/channels?apikey=AQEAAAABAAD_rAp4DJh05a1HAwFT3A6K');

//{"hi":{"ver":"0.20.3","lang":"en-US","platf":"web"}}

function GetMessagesFromServer() {
    client.on('message', (res) => {
        let obj = JSON.parse(utf8decoder.decode(res));
        if (Object.keys(obj).findIndex(c => c == 'ctrl') > -1) {
            EventEmitter.emit('ctrl', obj.ctrl);
        }
    })
}

function AuthTheServer() {
    let randNumber = Math.floor(Math.random() * 90000) + 10000;
    client.on('open', () => {
        client.send(`{"hi":{"ver":"0.20.3","lang":"en-US","platf":"web","id":"${randNumber}"}}`);
    });
    EventEmitter.on('ctrl', (res) => {
        if (res.id == randNumber) {
            if (!res.text && res.test != "created") {
                throw new Error('Cannot Authentication with tinode server');
            }
        }
    })
}

function ConnectToMySQLDatabase() {
    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + connection.threadId);
    })
}