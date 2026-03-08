import { describe, expect, it } from 'vitest';
import { safeParseAnswer } from '@/utils/parser';

describe('safeParseAnswer', () => {
  it('parses python-like list safely', () => {
    const input = "[{'id':'x1','name':'John','isSmoke':True}]";
    const result = safeParseAnswer(input);
    expect(result.structured.report_list).toEqual([{ id: 'x1', name: 'John', isSmoke: true }]);
  });

  it('handles empty string', () => {
    const result = safeParseAnswer('');
    expect(result.text).toBe('');
    expect(result.structured).toEqual({});
  });
});
