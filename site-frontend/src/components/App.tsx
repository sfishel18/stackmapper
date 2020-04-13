import * as React from "react";
import styled, { createGlobalStyle } from 'styled-components';
import { Button, Grommet, Select, TextArea, TextInput } from 'grommet';
import { DualRing } from 'react-awesome-spinners';
import ResponseTextArea from './ResponseTextArea';
import theme from "./theme";

const GlobalStyle = createGlobalStyle`
    html {
        height: 100%;
    }
    body {
        margin: 0;
        height: 100%;
    }
    #app {
        height: 100%;
    }
`;

const StyledGrommet = styled(Grommet)`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 15px;

    & > * {
        width: 1140px;
        max-width: 100%;
    }
`;

const HeaderSection = styled(Section)`
    background-color: ${theme.global.colors.brand};
    color: ${theme.global.colors.white};
`;

const BodySection = styled(Section)`
    height: 100%;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
`;

const SourceMapRow = styled(Row)`
    align-items: center;
    justify-content: flex-start;

    & > * {
        margin-right: 10px;
    }
`;

const UrlInputWrapper = styled.div`
    width: 500px;
`;

const StackTraceRow = styled(Row)`
    height: 100%;
    flex: 1 1 auto;

    & > :first-child {
        margin-right: 15px;
    }
`;

const TextAreaWrapper = styled.div`
    position: relative;
    display: flex;
    flex: 1 1 auto;
`;

const LoadingWrapper = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${theme.global.colors['light-3']}
`;

const ButtonRow = styled(Row)``;

type SourceMap = string | File;

export interface AppProps {
    onTransform: (stackTrace: string, sourceMap: SourceMap) => Promise<{ trace: string }>,
}

export default (props: AppProps) => {
    const [sourceMapInputType, setSourceMapInputType] = React.useState('URL');
    const [sourceMapUrl, setSourceMapUrl] = React.useState('');
    const [stackTrace, setStrackTrace] = React.useState('');
    const [response, setResponse] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleOnTransform = () => {
        setIsLoading(true);
        let sourceMapContent : SourceMap = '';
        if (sourceMapInputType === 'URL') {
            sourceMapContent = sourceMapUrl;
        } else {
            const fileInput = fileInputRef.current;
            if (fileInput && fileInput.files) {
                sourceMapContent = fileInput.files[0];
            }
            
        }
        props.onTransform(stackTrace, sourceMapContent)
            .then(({ trace }) => setResponse(trace))
            .catch(e => setError(e.message))
            .finally(() => setIsLoading(false));
    }

    return (
        <StyledGrommet theme={theme}>
            <GlobalStyle />
            <HeaderSection>
                <div>
                    <h1>Stack Mapper</h1>
                </div>
            </HeaderSection>
            <BodySection>
                <SourceMapRow>
                    <h3>Source Map:</h3>
                    <Select
                        options={['URL', 'File']}
                        onChange={({ option }) => setSourceMapInputType(option)}
                        value={sourceMapInputType}
                    />
                    {sourceMapInputType === 'URL' && (
                        <UrlInputWrapper>
                            <TextInput 
                                onChange={e => setSourceMapUrl(e.target.value)} 
                                placeholder="Enter source map URL"
                                value={sourceMapUrl} 
                            />
                        </UrlInputWrapper>
                    )}
                    {sourceMapInputType === 'File' && <input type="file" ref={fileInputRef} />}
                </SourceMapRow>
                <StackTraceRow>
                    <TextAreaWrapper>
                        <TextArea placeholder="Paste stack trace here" value={stackTrace} onChange={e => setStrackTrace(e.target.value)} />
                    </TextAreaWrapper>
                    <TextAreaWrapper>
                        {isLoading && <LoadingWrapper><DualRing color={theme.global.colors.brand} /></LoadingWrapper>}
                        <ResponseTextArea error={error} disabled placeholder="Mapped stack trace will appear here" value={response} />
                    </TextAreaWrapper>
                </StackTraceRow>
                <ButtonRow>
                    <Button label="Transform" onClick={handleOnTransform} />
                </ButtonRow>
            </BodySection>
        </StyledGrommet>
    )
};
