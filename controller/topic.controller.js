import express from 'express';
import {client, connection, EventEmitter} from "../app";

const topicController = express.Router();

topicController.get('/CreateNewTopic/:name', (req, res) => {
    let genId = Math.floor(Math.random() * 90000) + 10000;

    let data = {
        sub: {
            id: genId.toString(),
            topic: `new${genId}`,
            set: {
                desc: {
                    public: {
                        fn: req.params.name
                    }
                }
            }
        }
    }

    client.send(JSON.stringify(data));
    EventEmitter.on("ctrl", (result) => {
        if (result.id == genId) {
            if (result.text && result.text == 'ok') {
                res.status(200).json({
                    data: true,
                    param: result.params,
                    topic: result.topic,
                    status: 'Create topic succeed.'
                });
            } else {
                res.status(200).json({
                    data: false,
                    status: result.text,
                });
            }
        }
    })

});

topicController.get('/LeaveTopic/:name', (req, res) => {
    let genId = Math.floor(Math.random() * 90000) + 10000;

    let data = {
        leave: {
            id: genId.toString(),
            topic: req.params.name
        }
    }

    client.send(JSON.stringify(data));
    EventEmitter.on("ctrl", (result) => {
        if (result.id == genId) {
            if (result.text && result.text == 'ok') {
                res.status(200).json({
                    data: true,
                    param: result.params,
                    status: 'Leave topic succeed.'
                });
            } else {
                res.status(200).json({
                    data: false,
                    status: result.text,
                });
            }
        }
    })

});

topicController.get('/DeleteTopic/:name', (req, res) => {
    let genId = Math.floor(Math.random() * 90000) + 10000;

    let data = {
        del: {
            id: genId.toString(),
            topic: req.params.name,
            what: "topic",
            hard: true
        }
    }

    client.send(JSON.stringify(data));
    EventEmitter.on("ctrl", (result) => {
        if (result.id == genId) {
            if (result.text && result.text == 'ok') {
                res.status(200).json({
                    data: true,
                    param: result.params,
                    status: 'Delete topic succeed.'
                });
            } else {
                res.status(200).json({
                    data: false,
                    status: result.text,
                });
            }
        }
    })

});

topicController.get('/UpdateTopic/:topic/:name', (req, res) => {
    connection.query("CALL UpdateTopicName(?,?)", [req.params.name, req.params.topic], (error, results) => {
        if (error) {
            res.status(200).json({
                data: false,
                status: error.message
            });
        }
        if (results) {
            res.status(200).json({
                data: true,
                status: "Update topic succeed."
            });
        }
    })
});

topicController.get('/AddUserToTopic/:username/:topic', (req, res) => {
    let genId = Math.floor(Math.random() * 90000) + 10000;
    connection.query("CALL GetUserIdByUsername(?)", [req.params.username], (error, results) => {
        if (error) {
            res.status(200).json({
                data: false,
                status: error.message
            });
        }
        if (results[0][0].topicId) {
            let data = {
                set: {
                    id: genId.toString(),
                    topic: req.params.topic,
                    sub: {
                        user: results[0][0].topicId
                    }
                }
            }
            client.send(JSON.stringify(data));
        }
    })

    EventEmitter.on("ctrl", (result) => {
        if (result.id == genId) {
            if (result.text && result.text == 'ok') {
                res.status(200).json({
                    data: true,
                    param: result.params,
                    status: 'user successfully added.'
                });
            } else {
                res.status(200).json({
                    data: false,
                    status: result.text,
                });
            }
        }
    })
});
export default topicController;