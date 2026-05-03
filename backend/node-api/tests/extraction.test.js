const { runExtraction } = require('../src/services/extraction.service');
const { enqueue, getStatus } = require('../src/services/extractionQueue');
const Judgment = require('../src/models/Judgment');
const User = require('../src/models/User');

// Mock the nlpBridge
jest.mock('../src/utils/nlpBridge', () => ({
  extractDirectives: jest.fn(),
  extractDirectivesFromText: jest.fn(),
  checkHealth: jest.fn(),
}));

const nlpBridge = require('../src/utils/nlpBridge');

describe('Extraction Service', () => {
  let user;

  beforeEach(async () => {
    user = await User.create({
      name: 'Test', email: 'test@test.gov.in', password: 'test12345',
      role: 'admin', department: 'General',
    });
  });

  it('should extract directives and create records', async () => {
    const judgment = await Judgment.create({
      caseId: 'EXT/2024/001',
      fileUrl: '/tmp/test.pdf',
      uploadedBy: user._id,
    });

    nlpBridge.extractDirectives.mockResolvedValue({
      full_text: 'Test judgment text',
      metadata: { court_name: { value: 'High Court of Karnataka', confidence: 0.9 } },
      extraction_info: { total_pages: 5, method: 'digital', avg_confidence: 0.9 },
      directives: [
        {
          directive_text: 'The department shall submit a report',
          main_action: 'submit report',
          conditions: [],
          deadline: '2025-06-15',
          deadline_text: 'within 60 days',
          responsible_department: 'Environment',
          responsible_entity: 'Department of Environment',
          source_page: 5,
          source_text: 'The department shall submit a report',
          confidence: 0.85,
          review_status: 'auto_accepted',
        },
      ],
    });

    const result = await runExtraction(judgment._id.toString());
    expect(result.directivesFound).toBe(1);
    expect(result.tasksCreated).toBe(1);

    const updated = await Judgment.findById(judgment._id);
    expect(updated.extractionStatus).toBe('completed');
    expect(updated.courtName).toBe('High Court of Karnataka');
  });

  it('should handle NLP timeout with error code', async () => {
    const judgment = await Judgment.create({
      caseId: 'EXT/2024/002',
      fileUrl: '/tmp/test.pdf',
      uploadedBy: user._id,
    });

    nlpBridge.extractDirectives.mockRejectedValue(
      Object.assign(new Error('timeout'), { code: 'ECONNABORTED' })
    );

    await expect(runExtraction(judgment._id.toString())).rejects.toThrow();

    const updated = await Judgment.findById(judgment._id);
    expect(updated.extractionStatus).toBe('failed');
    expect(updated.extractionError).toBe('NLP_TIMEOUT');
  });

  it('should handle corrupt PDF (422)', async () => {
    const judgment = await Judgment.create({
      caseId: 'EXT/2024/003',
      fileUrl: '/tmp/corrupt.pdf',
      uploadedBy: user._id,
    });

    nlpBridge.extractDirectives.mockRejectedValue(
      Object.assign(new Error('corrupt'), { response: { status: 422 } })
    );

    await expect(runExtraction(judgment._id.toString())).rejects.toThrow();

    const updated = await Judgment.findById(judgment._id);
    expect(updated.extractionStatus).toBe('failed');
    expect(updated.extractionError).toBe('INVALID_PDF');
  });
});

describe('Extraction Queue', () => {
  it('should report correct status', () => {
    const status = getStatus();
    expect(status).toHaveProperty('queueLength');
    expect(status).toHaveProperty('completed');
    expect(status).toHaveProperty('failed');
  });
});
