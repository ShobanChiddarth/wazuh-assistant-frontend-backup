import { buildIndexerProxyUrl } from './backend';

export async function executeIndexerProxy(body) {
  const response = await fetch(buildIndexerProxyUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed: ${response.status} ${response.statusText} ${text}`);
  }

  return response.json();
}
