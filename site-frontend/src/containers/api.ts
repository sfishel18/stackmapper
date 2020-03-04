const API_URL = process.env.API_URL;

export const transformStackTrace = (stackTrace: string, sourceMap: string) => 
    fetch(`${API_URL}/transform`, { 
        body: JSON.stringify({ stackTrace, sourceMap }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST', 
    }).then(response => response.json());
