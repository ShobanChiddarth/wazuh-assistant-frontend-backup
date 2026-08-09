import { backendUrl } from './backend';

const buildGenerateQueryUrl = () => `${backendUrl.replace(/\/$/, '')}/generate-query`;

export async function generateQueryPrompt(payload) {
  const response = await fetch(buildGenerateQueryUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();

  if (!response.ok) {
    const message = text || `Request failed: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error('Invalid JSON response from generate-query endpoint.');
  }
}
