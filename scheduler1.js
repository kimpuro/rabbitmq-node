const http = require('http');

function getCountAndSend() {
    http.get('http://localhost:3001/count', (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
            console.log('GET /count (3001):', data);
            try {
                const json = JSON.parse(data);
                const count = json.count;
                fetch('http://localhost:3003/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ count: count })
                })
                .then(res => res.text())
                .then(body => {
                    console.log('POST to 3003:', body);
                })
                .catch(err => {
                    console.error('Error posting to 3003:', err.message);
                });
            } catch (e) {
                console.error('Error parsing /count response:', e.message);
            }
        });
    }).on('error', (err) => {
        console.error('Error fetching /count:', err.message);
    });
}

setInterval(() => {
    getCountAndSend();
}, 10000);
