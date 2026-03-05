const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// API endpoint for appointment
app.post('/api/agendar', (req, res) => {
    const { nombre, servicio, fecha, hora, direccion, telefono } = req.body;

    // Validate required fields
    if (!nombre || !servicio || !fecha || !hora || !direccion || !telefono) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son obligatorios.'
        });
    }

    // Build WhatsApp message
    const mensaje = `✨ *Nueva cita solicitada en M&Z Studio* ✨%0A%0A` +
        `👤 *Nombre:* ${nombre}%0A` +
        `💅 *Servicio:* ${servicio}%0A` +
        `📅 *Fecha:* ${fecha}%0A` +
        `🕐 *Hora:* ${hora}%0A` +
        `📍 *Dirección:* ${direccion}%0A` +
        `📞 *Teléfono:* ${telefono}`;

    const whatsappURL = `https://wa.me/522222592158?text=${mensaje}`;

    res.json({
        success: true,
        message: 'Cita procesada correctamente.',
        whatsappURL
    });
});

// API endpoint to get available time slots
app.get('/api/horarios', (req, res) => {
    const horarios = [];
    for (let h = 10; h < 19; h++) {
        horarios.push(`${h.toString().padStart(2, '0')}:00`);
    }
    res.json({ horarios });
});

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server (for local development)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🌸 M&Z Studio server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
