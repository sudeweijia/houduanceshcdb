// Login Page Logic
if (window.location.pathname.endsWith('login.html')) {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const password = document.getElementById('password-input').value;

        // 密码验证逻辑
        if (password === '32cl47') { // 修改为你的密码
            window.location.href = 'index.html'; // 密码正确，跳转到主界面
        } else {
            errorMessage.classList.remove('hidden'); // 密码错误，显示错误提示
        }
    });
}

// Main Page Logic
if (window.location.pathname.endsWith('index.html')) {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messagesList = document.getElementById('messages');

    // 加载留言
    async function loadMessages() {
        try {
            const response = await fetch('/api/messages');
            const messages = await response.json();
            messagesList.innerHTML = '';
            messages.forEach(msg => {
                const li = document.createElement('li');
                li.textContent = msg.message;
                messagesList.appendChild(li);
            });
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    // 提交新留言
    messageForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const message = messageInput.value.trim();
        if (message) {
            try {
                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message }),
                });
                if (response.ok) {
                    messageInput.value = '';
                    loadMessages();
                }
            } catch (error) {
                console.error('Error submitting message:', error);
            }
        }
    });

    // 初始化加载留言
    loadMessages();
}