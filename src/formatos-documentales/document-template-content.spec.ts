import { getTemplateSeeds } from './document-template-content.js';

describe('document template seed content', () => {
  it('defines the five DOCX-backed quote templates with corrected EtO text', () => {
    const templates = getTemplateSeeds();

    expect(templates.map(({ codigo }) => codigo)).toEqual([
      'R-CM-07-1',
      'R-CM-07-2',
      'R-CM-07-3',
      'R-CM-07-4',
      'R-CM-07-5',
    ]);
    const paragraphs = templates[1].configuracion_json.paragraphs;
    const text = Array.isArray(paragraphs)
      ? paragraphs.filter((paragraph): paragraph is string => typeof paragraph === 'string').join(' ')
      : '';
    expect(text).toMatch(/EtO/i);
    expect(text).not.toMatch(/institucional con vapor/i);
    expect(templates[4].configuracion_json).toMatchObject({
      document_code: 'R-CM-07-5',
      version_label: '04',
      version_date: '2026-09-17',
    });
  });
});
