const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/order', (req, res) => {
    const order = req.body.order;

    if (!order) {
        return res.status(400).json({ error: 'Order is missing' });
    }

    console.log('Received order:', order);

    res.json({
        status: 'success',
        message: 'Order received',
        orderReceived: order
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

