export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export interface RequestHandler {
  (req: Request): Promise<Response>;
}

export const withErrorHandling = (handler: RequestHandler): RequestHandler => {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error: any) {
      console.error('Error in edge function:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  };
};

export const withCORS = (handler: RequestHandler): RequestHandler => {
  return async (req: Request) => {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    return handler(req);
  };
};

export const withAuth = (handler: RequestHandler): RequestHandler => {
  return async (req: Request) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    return handler(req);
  };
};

export const withJSONBody = (handler: RequestHandler): RequestHandler => {
  return async (req: Request) => {
    try {
      const contentType = req.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Content-Type must be application/json');
      }
      await req.json();
      return handler(req);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  };
};

export const createHandler = (handler: RequestHandler): RequestHandler => {
  return withErrorHandling(
    withCORS(
      withAuth(
        withJSONBody(handler)
      )
    )
  );
}; 