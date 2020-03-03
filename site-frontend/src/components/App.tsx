import * as React from "react";
import styled, { createGlobalStyle } from 'styled-components';
import { Button, Grommet, Select, TextArea, TextInput } from 'grommet';

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
    background-color: #f00;
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

const ButtonRow = styled(Row)``

export interface AppProps {}

export default () => {
    const [sourceMapInputType, setSourceMapInputType] = React.useState('URL');
    const [sourceMapUrl, setSourceMapUrl] = React.useState('');
    const fileInputRef = React.useRef(null)
    return (
        <StyledGrommet plain>
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
                    <TextArea placeholder="Paste stack trace here" />
                    <TextArea disabled placeholder="Mapped stack trace will appear here" />
                </StackTraceRow>
                <ButtonRow>
                    <Button label="Transform" />
                </ButtonRow>
            </BodySection>
        </StyledGrommet>
    )
};
