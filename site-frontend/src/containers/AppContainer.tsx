import * as React from "react";
import App from '../components/App';
import { transformStackTrace } from './api';

const onTransform = (stackTrace: string, sourceMap: string | File) => transformStackTrace(stackTrace, sourceMap);

export default () => <App onTransform={onTransform} />;
