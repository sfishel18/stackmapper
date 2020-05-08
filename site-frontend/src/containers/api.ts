import { SuspenseResource } from "../types";

function wrapPromise<T>(promise: Promise<T>): SuspenseResource<T> {
  let status = 'pending'
  let response: T;

  const suspender = promise.then(
    (res) => {
      status = 'success';
      response = res;
    },
    (err) => {
      status = 'error';
      response = err;
    },
  );

  const read = () => {
    switch (status) {
      case 'pending':
        throw suspender;
      case 'error':
        throw response;
      default:
        return response;
    }
  };

  return { read };
}
  
const API_URL = process.env.API_URL;

interface ResponseBody<T> {
    ok: boolean,
    statusText: string,
    json: () => Promise<T>
}

interface ErrorResponseBody extends ResponseBody<{ message: string }> {
    ok: false,
}

interface SuccessResponseBody<T> extends ResponseBody<T> {
    ok: true,
}

function handleErrors<T>(response: SuccessResponseBody<T> | ErrorResponseBody) {
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

export interface TransformStackTraceResponse {
  trace: string,
}

const transformStackTrace = (stackTrace: string, sourceMap: string | File) => {
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
    .then(response => handleErrors<TransformStackTraceResponse>(response))
    .then(response => response.json())
};

export const fetchTransformedStackTrace = (stackTrace: string, sourceMap: string | File) => wrapPromise(transformStackTrace(stackTrace, sourceMap))
