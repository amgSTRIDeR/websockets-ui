import WebSocket from 'ws';

export default function startWebSocketServer(port: number) {
    const wss = new WebSocket.Server({ port });

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            const messageString = message.toString();
            try {
                const parsedMessage = JSON.parse(messageString);
                console.log('Received message:', parsedMessage);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        })

        ws.onclose = (event) => {
            console.log('WebSocket server closed');
        };
    })


    process.on('SIGINT', () => {
        wss.close(() => {
            process.exit(0);
        });
    })
}