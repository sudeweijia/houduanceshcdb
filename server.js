const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Atlas 连接配置
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://1494130690:H8rDkjr2IOw8hq2pH8rDkjr2IOw8hq2p@sudeweijia.gluja.mongodb.net/?retryWrites=true&w=majority&appName=sudeweijia'; // 替换为你的 MongoDB Atlas 连接字符串
const dbName = 'sudeweijia'; // 数据库名称
const collectionName = 'su'; // 集合名称

// 中间件：解析 JSON 请求体
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 获取留言列表
app.get('/api/messages', async (req, res) => {
    let client;
    try {
        client = new MongoClient(mongoUri);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const messages = await collection.find().toArray();
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    } finally {
        if (client) client.close();
    }
});

// 提交新留言
app.post('/api/messages', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    let client;
    try {
        client = new MongoClient(mongoUri);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.insertOne({ message, timestamp: new Date() });
        res.status(201).json(result.ops[0]);
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to save message' });
    } finally {
        if (client) client.close();
    }
});

// 默认路由：跳转到登录页面
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});