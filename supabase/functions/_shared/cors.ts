interface RequestLike {
  headers: {
    get(name: string): string | null;
  };
}

export const corsHeaders = (req: RequestLike) => ({
  'Access-Control-Allow-Origin': req.headers.get('origin') || 'http://localhost:8080',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true'
});

export const handleCors = (req: RequestLike, res: Response) => {
  const headers = corsHeaders(req);
  for (const [key, value] of Object.entries(headers)) {
    res.headers.set(key, value);
  }
  return res;
}; 