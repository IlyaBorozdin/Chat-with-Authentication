document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'https://localhost:443';
    const content = document.querySelector('#content');

    content.addEventListener('click', followLink);
    content.addEventListener('chat', chat);
    content.addEventListener('refresh', refresh);
    content.addEventListener('access', access);
    content.addEventListener('sign-in', signIn);
    content.addEventListener('sign-up', signUp);
    content.addEventListener('sign-out', signOut);

    content.dispatchEvent(new Event('chat'));

    function showContent(res) {
        return res.text().then((html) => {
            content.classList.remove('active');
            setTimeout(() => {
                content.innerHTML = html;
                commonListeners();
                content.classList.add('active');
            }, 250);
        })
    }

    function commonListeners() {
        const buttonSignOut = document.querySelector('#signOut');
        const formIn = document.querySelector('#formIn');
        const formUp = document.querySelector('#formUp');

        if (buttonSignOut) {
            buttonSignOut.addEventListener('click', (event) => {
                content.dispatchEvent(new Event('sign-out'));
            });
        }
        if (formIn) {
            formIn.addEventListener('submit', (event) => {
                event.preventDefault();
                content.dispatchEvent(new Event('sign-in'));
            });
        }
        if (formUp) {
            formUp.addEventListener('submit', (event) => {
                event.preventDefault();
                content.dispatchEvent(new Event('sign-up'));
            });
        }
    }

    function followLink(event) {
        if (event.target.tagName === 'A') {
            event.preventDefault();
    
            fetch(event.target.getAttribute('href'))
                .then(showContent)
                .catch(err => {
                    console.error('An error occurred:', err);
                });
        }
    }

    function accessWithAuthentication(to) {
        const accessToken = localStorage.getItem('accessToken');

        return fetch(BASE_URL + to, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
            .then((res) => {
                if (res.status !== 401) {
                    return res;
                }
                throw new Error('Unauthorized');
            })
            .catch((err) => {
                if (err.message === 'Unauthorized') {
                    content.dispatchEvent(new Event('refresh'));
                } else {
                    console.error('An error occurred:', err);
                }
                return Promise.reject(err);
            });
    }

    function chat(event) {
        accessWithAuthentication('/chat')
            .then(async (res) => {
                const response = await fetch(BASE_URL + '/connection');
                if (response.ok) {
                    return res;
                }
                return Promise.reject(new Error('No connection established'));
            })
            .then(showContent, (err) => {
                console.error('An error occurred:', err);
            });
    }

    function refresh(event) {
        fetch(BASE_URL + '/api/auth', {
            method: 'PUT'
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                return res.json().then((err) => Promise.reject(err));
            })
            .then((tokens) => {
                localStorage.setItem('accessToken', tokens.accessToken);
                content.dispatchEvent(new Event('chat'));
            })
            .catch((err) => {
                content.dispatchEvent(new Event('access'));
            });
    }

    function access(event) {
        fetch(BASE_URL + '/access')
            .then(showContent)
            .catch(err => {
                console.error('An error occurred:', err);
            });
    }

    function signIn(event) {
        const form = document.querySelector('#formIn');
        const errorText = document.querySelector('#errorText');

        const formData = new FormData(form);
        const req = Object.fromEntries(formData.entries());

        fetch(BASE_URL + '/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req)
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                return res.json().then((err) => Promise.reject(err));
            })
            .then((tokens) => {
                errorText.innerHTML = '';
                localStorage.setItem('accessToken', tokens.accessToken);
                content.dispatchEvent(new Event('chat'));
                return;
            })
            .catch((err) => {
                errorText.innerHTML = err.userMessage;
                return;
            });        
    }

    function signUp(event) {
        const form = document.querySelector('#formUp');
        const errorText = document.querySelector('#errorText');

        const formData = new FormData(form);
        const req = Object.fromEntries(formData.entries());

        fetch(BASE_URL + '/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req)
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                return res.json().then((err) => Promise.reject(err));
            })
            .then((tokens) => {
                errorText.innerHTML = '';
                localStorage.setItem('accessToken', tokens.accessToken);
                return fetch(BASE_URL + '/confirmation.html');
            })
            .then(showContent)
            .catch((err) => {
                if (err.suggestions) {
                    errorText.innerHTML = err.suggestions.join('\n');
                    return;
                }

                errorText.innerHTML = err.userMessage;
                return;
            });      
    }

    function signOut(event) {
        const errorText = document.querySelector('#errorText');

        fetch(BASE_URL + '/api/auth', {
            method: 'DELETE'
        })
            .then((res) => {
                if (res.ok) {
                    localStorage.removeItem('accessToken');
                    content.dispatchEvent(new Event('chat'));
                    return;
                }
                return res.json().then((err) => Promise.reject(err))
            })
            .catch((err) => {
                errorText.innerHTML = err.userMessage;
                return;
            });
    }
});