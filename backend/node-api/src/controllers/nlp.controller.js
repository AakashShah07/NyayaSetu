const Judgment = require('../models/Judgment');
const nlpBridge = require('../utils/nlpBridge');
const { success, error } = require('../utils/apiResponse');

const health = async (req, res, next) => {
  try {
    const nlpHealth = await nlpBridge.checkHealth();
    return success(res, nlpHealth, 'NLP service is healthy');
  } catch (err) {
    return error(res, 'NLP service is unavailable', 503);
  }
};

const extract = async (req, res, next) => {
  try {
    const judgment = await Judgment.findById(req.params.judgmentId);
    if (!judgment) return error(res, 'Judgment not found', 404);

    judgment.extractionStatus = 'processing';
    await judgment.save();

    try {
      const textResult = await nlpBridge.extractText(judgment.fileUrl);
      judgment.extractedText = textResult.text;

      const entities = await nlpBridge.extractEntities(textResult.text);

      judgment.extractionStatus = 'completed';
      judgment.extractedAt = new Date();
      await judgment.save();

      return success(res, { text: textResult.text, entities }, 'Extraction completed');
    } catch (extractionError) {
      judgment.extractionStatus = 'failed';
      await judgment.save();
      return error(res, `Extraction failed: ${extractionError.message}`, 500);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { health, extract };
