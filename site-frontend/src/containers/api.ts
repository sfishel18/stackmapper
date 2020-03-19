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

export const transformStackTrace = (stackTrace: string, sourceMap: string | File) => {
    let body;
    const sourceMapIsFile = sourceMap instanceof File;
    if (sourceMapIsFile) {
        body = new FormData();
        body.append('sourceMap', sourceMap)
    } else {
        body = JSON.stringify({ stackTrace, sourceMap });
    }
    return fetch(`${API_URL}/transform`, { 
        body,
        headers: {...(sourceMapIsFile ? {} : { 'Content-Type': 'application/json' }) },
        method: 'POST', 
    })
    .then(handleErrors)
    .then(response => response.json())
};
