const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(bodyParser.json());
app.use(cors());

let fileCounter = 1;

app.post('/', (req, res) => {
  const { channelName } = req.body;
  console.log('Received channel name:', channelName);

  const logData = {
    userlive: {
      channelName,
      timestamp: new Date().toISOString()
    }
  };

  const fileName = `livestreaming/userlive${fileCounter}.json`;

  fs.writeFile(fileName, JSON.stringify(logData, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      res.status(500).json({ message: 'Error writing to file' });
    } else {
      console.log('Log saved to file:', fileName);
      res.status(200).json({ message: 'Channel name received and logged successfully' });
    }
  });

  fileCounter++;
});

app.get('/:fileNumber', (req, res) => {
  const fileNumber = req.params.fileNumber;
  const fileName = `livestreaming/userlive${fileNumber}.json`;

  fs.readFile(path.resolve(__dirname, fileName), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ message: 'Error reading file' });
    } else {
      try {
        const jsonData = JSON.parse(data);
        res.status(200).json(jsonData);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.status(500).json({ message: 'Error parsing JSON' });
      }
    }
  });
});

// Start the server
app.listen(3004, () => {
  console.log('Server is running on port 3004');
});
