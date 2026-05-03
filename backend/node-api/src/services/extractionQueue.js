const { runExtraction } = require('./extraction.service');

const jobs = [];
let processing = false;

function enqueue(judgmentId) {
  const job = {
    judgmentId,
    status: 'pending',
    error: null,
    startedAt: null,
    completedAt: null,
    enqueuedAt: new Date(),
  };
  jobs.push(job);
  _processNext();
  return job;
}

function getStatus() {
  const pending = jobs.filter((j) => j.status === 'pending').length;
  const completed = jobs.filter((j) => j.status === 'completed').length;
  const failed = jobs.filter((j) => j.status === 'failed').length;
  const current = jobs.find((j) => j.status === 'processing');

  return {
    queueLength: pending,
    processing: current?.judgmentId || null,
    completed,
    failed,
    total: jobs.length,
  };
}

function getJobs(limit = 50) {
  return jobs.slice(-limit).reverse();
}

async function _processNext() {
  if (processing) return;

  const job = jobs.find((j) => j.status === 'pending');
  if (!job) return;

  processing = true;
  job.status = 'processing';
  job.startedAt = new Date();

  try {
    await runExtraction(job.judgmentId);
    job.status = 'completed';
    job.completedAt = new Date();
  } catch (err) {
    job.status = 'failed';
    job.error = err.extractionErrorCode || err.message;
    job.completedAt = new Date();
  } finally {
    processing = false;
    // Process next in queue
    setImmediate(_processNext);
  }
}

module.exports = { enqueue, getStatus, getJobs };
