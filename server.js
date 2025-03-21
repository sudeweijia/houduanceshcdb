const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Atlas 连接配置
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://1494130690:H8rDkjr2IOw8hq2pH8rDkjr2IOw8hq2p@sudeweijia.gluja.mongodb.net/?retryWrites=true&w=majority&appName=sudeweijia'; // 替换为你的 MongoDB Atlas 连接字符串
const dbName = 'sudeweljia'; // 数据库名称
const collectionName = 'su'; // 集合名称

// Session 中间件
app.use(session({
    secret: 'your-secret-key', // 用于加密 Session 的密钥
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // 设置为 true 如果你使用 HTTPS
}));

// 中间件：解析 JSON 请求体
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 登录接口
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === '32cl47') { // 验证密码
        req.session.isLoggedIn = true; // 设置 Session
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Incorrect password' });
    }
});

// 获取留言列表
app.get('/api/messages', async (req, res) => {
    if (!req.session.isLoggedIn) { // 检查是否已登录
        return res.status(401).json({ error: 'Unauthorized' });
    }

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
    if (!req.session.isLoggedIn) { // 检查是否已登录
        return res.status(401).json({ error: 'Unauthorized' });
    }

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
