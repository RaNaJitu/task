const express = require('express');
const bodyParser = require('body-parser');
const gravatar = require('gravatar');
const synonyms = require('synonyms');
const wordnet = require('wordnet');
const { async } = require('rxjs');
const axios = require('axios');
var thesaurus = require("thesaurus");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
Backend - Node.js - Technical Task – BNT01:
Gravatar & Clearbit Logo API
 */
app.get('/', (req, res) => {
  res.send(`
    <form method="POST" action="/lookup">
      <input type="text" name="input" placeholder="Enter an email or website">
      <button type="submit">Lookup</button>
    </form>
  `);
});


app.post('/lookup', async (req, res) => {
  const input = req.body.input.trim();
  let imageUrl = null;

  if (!input) {
    return res.send('Please enter an email or website');
  }

  if (input.includes('@')) {
    // input is an email address
    imageUrl = gravatar.url(input, { s: '200', r: 'identicon' });
  } else {
    // input is a website domain
    const domain = input.replace(/(^\w+:|^)\/\//, '').split('/')[0];
    try {
      const response = await axios.get(`https://logo.clearbit.com/${domain}`);
      imageUrl = response.request.res.responseUrl;
    } catch (error) {
      // clearbit API error handling
      if (error.response && error.response.status === 404) {
        return res.send('No logo found for this website');
      }
      return res.send('An error occurred while fetching the logo');
    }
  }

  if (!imageUrl || imageUrl.endsWith('404')) {
    return res.send('No image found for this email or website');
  }

  const inputType = input.includes('@') ? 'Email' : 'Website';
  res.send(`
    <h1>${input}</h1>
    <p>Type: ${inputType}</p>
    <img src="${imageUrl}" alt="${input} avatar">
  `);
});




/*
Backend - Node.js - Technical Task – BNT03:
A simple text spinner
 */
app.get('/spin', (req, res) => {
  res.send(`
    <html>
      <body>
        <form method="POST" action="/spin">
          <textarea name="sourceText" rows="10" cols="50"></textarea><br>
          <button type="submit">Spin Text</button>
        </form>
      </body>
    </html>
  `);
});

app.post('/spin', async (req, res) => {
  const sourceText = req.body.sourceText;
  
  try {

  // Split input text into words
  const words = sourceText.split(' ');

  // Perform text spinning
  const spunWords = words.map((word) => {
    // Find synonyms for the word using thesaurus
    const synonyms = thesaurus.find(word);

    // Replace the word with a random synonym, if available
    if (synonyms && synonyms.length > 0) {
      const randomIndex = Math.floor(Math.random() * synonyms.length);
      return synonyms[randomIndex];
    } else {
      return word;
    }
  });

  // Join the spun words back into a text
  const spunText = await spunWords.join(' ');

  // Display the resulting spun text to the user
  res.send(`Spun Text of ${sourceText} is ${spunText}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred during text spinning.');
  }
  
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});