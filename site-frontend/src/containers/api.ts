const API_URL = process.env.API_URL;

const handleErrors = response => {
    if (!response.ok) {
        let errorMessage = response.statusText;
        try {
            return response.json().then(({ message }) => { 
                throw new Error(message || errorMessage)
            })
        } catch (e) {}
        throw Error(errorMessage);
    }
    return response;
}

export const transformStackTrace = (stackTrace: string, sourceMap: string) => 
    fetch(`${API_URL}/transform`, { 
        body: JSON.stringify({ stackTrace, sourceMap }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST', 
    })
    .then(handleErrors)
    .then(response => response.json());
