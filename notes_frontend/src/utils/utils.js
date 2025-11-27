const env = process.env || {};

// PUBLIC_INTERFACE
export function getEnvConfig() {
  const apiBase = env.REACT_APP_API_BASE;
  const backendUrl =
    env.REACT_APP_BACKEND_URL ||
    apiBase ||
    '';
  const hasBackend = Boolean(backendUrl && backendUrl.startsWith('http'));

  return {
    backendUrl,
    apiBase,
    hasBackend,
    frontendUrl: env.REACT_APP_FRONTEND_URL || '',
    wsUrl: env.REACT_APP_WS_URL || '',
    nodeEnv: env.REACT_APP_NODE_ENV || env.NODE_ENV || 'development',
  };
}

// PUBLIC_INTERFACE
export function generateId() {
  return `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
