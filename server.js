const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();

const CLIENT_ID = '170549';
const CLIENT_SECRET = '170549';
const REDIRECT_URI = 'https://your-app.fly.dev/auth_callback';

app.use(express.static(path.join(__dirname)));

app.get('/auth/strava', (req, res) => {
  const url = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=read,activity:read&approval_prompt=auto`;
  res.redirect(url);
});

app.get('/auth_callback', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth_callback.html'));
});

// Optional: Exchange code for token
app.get('/exchange_token', async (req, res) => {
  const code = req.query.code;
  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: 'authorization_code'
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
