class InteractiveChatbox {
    constructor(button, chatbox, icons) {
        this.button = button;
        this.chatbox = chatbox;
        this.icons = icons;
        this.state = false; 
        this.messagesContainer = document.querySelector('.chatbox__messages');
        this.inputField = document.querySelector('.chatbox__input');

        this.display();
        this.setupFormListener();
    }

    async sendMessage(message) {
        const response = await fetch('http://api.synlabs.pro/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (response.ok) {
            const data = await response.json();
            return data.response;
        } else {
            console.error('Error:', response.statusText);
            return null;
        }
    }

    display() {
        this.button.addEventListener('click', () => this.toggleState());
    }

    setupFormListener() {
        const form = document.querySelector('.chatbox__input-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userMessage = this.inputField.value;
            this.addMessage('You', userMessage);
            this.inputField.value = '';

            const response = await this.sendMessage(userMessage);
            if(response) {
                this.addMessage('AI', response);
            }
        });
    }

    toggleState() {
        this.state = !this.state;
        this.showOrHideChatBox();
    }

    showOrHideChatBox() {
        if(this.state) {
            this.chatbox.classList.add('chatbox--active');
            this.toggleIcon(true);
        } else {
            this.chatbox.classList.remove('chatbox--active');
            this.toggleIcon(false);
        }
    }

    toggleIcon(state) {
        const { isClicked, isNotClicked } = this.icons;
        const icon = this.button.children[0];

        if(state) {
            icon.innerHTML = isClicked; 
        } else {
            icon.innerHTML = isNotClicked;
        }
    }

    addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        this.messagesContainer.appendChild(messageElement);
    }
}
