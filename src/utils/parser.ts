import type { ChatStructuredData, ParsedResponsePayload } from '@/types/chat';

function normalizePythonLiterals(input: string): string {
  return input
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g, 'null');
}

function normalizeQuotes(input: string): string {
  return input.replace(/'/g, '"');
}

function tryParseJson<T = unknown>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function parsePossiblyPythonLikeJson(input: string): unknown {
  const direct = tryParseJson(input);
  if (direct !== null) {
    return direct;
  }

  const normalized = normalizeQuotes(normalizePythonLiterals(input));
  const normalizedParsed = tryParseJson(normalized);
  if (normalizedParsed !== null) {
    return normalizedParsed;
  }

  return null;
}

function toStructuredData(payload: unknown): ChatStructuredData {
  if (!payload || typeof payload !== 'object') {
    return {};
  }
  return payload as ChatStructuredData;
}

export function safeParseAnswer(answer?: string): ParsedResponsePayload {
  if (!answer?.trim()) {
    return { text: '', structured: {}, raw: null };
  }

  const parsed = parsePossiblyPythonLikeJson(answer.trim());
  if (!parsed) {
    return { text: answer, structured: {}, raw: answer };
  }

  if (typeof parsed === 'string') {
    return { text: parsed, structured: {}, raw: parsed };
  }

  if (Array.isArray(parsed)) {
    return {
      text: '',
      structured: { report_list: parsed },
      raw: parsed
    };
  }

  const objectData = parsed as Record<string, unknown>;
  const text =
    (typeof objectData.answer === 'string' && objectData.answer) ||
    (typeof objectData.summary === 'string' && objectData.summary) ||
    '';

  return {
    text,
    structured: toStructuredData(objectData),
    raw: objectData
  };
}
