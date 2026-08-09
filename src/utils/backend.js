export const backendUrl = process.env.REACT_APP_BACKEND_URL || '';

export const buildIndexerProxyUrl = () => `${backendUrl.replace(/\/$/, '')}/indexer-proxy`;
