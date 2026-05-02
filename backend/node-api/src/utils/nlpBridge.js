const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const env = require('../config/env');

const nlpClient = axios.create({
  baseURL: env.nlpServiceUrl,
  timeout: 60000,
});

const checkHealth = async () => {
  const { data } = await nlpClient.get('/health');
  return data;
};

const extractText = async (filePath) => {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  const { data } = await nlpClient.post('/extract/text', form, {
    headers: form.getHeaders(),
    timeout: 120000,
  });
  return data;
};

const extractEntities = async (text) => {
  const { data } = await nlpClient.post('/extract/entities', { text });
  return data;
};

module.exports = { checkHealth, extractText, extractEntities };
