import * as React from "react";
import App from '../components/App';
import { fetchTransformedStackTrace, TransformStackTraceResponse } from './api';
import { SuspenseResource } from "../types";

export default () => {
    const [transformedResource, setTransformedResource] = React.useState<SuspenseResource<TransformStackTraceResponse> | null>(null);
    const onTransform = React.useCallback((stackTrace: string, sourceMap: string | File) => {
        setTransformedResource(fetchTransformedStackTrace(stackTrace, sourceMap));
    }, [setTransformedResource, fetchTransformedStackTrace]);
    return <App onTransform={onTransform} transformedResource={transformedResource} /> 
};
