import * as React from "react";
import styled, { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
    }
`;

const Section = styled.div`
    display: flex;
    justify-content: center;
    padding: 0 15px;

    & > * {
        width: 1000px;
        max-width: 100%;
    }
`;

const HeaderSection = styled(Section)`
    background-color: #f00;
`;

export interface AppProps {}

export default () => <>
    <GlobalStyle />
    <HeaderSection><div><h1>StackMapper</h1></div></HeaderSection>
</>;
