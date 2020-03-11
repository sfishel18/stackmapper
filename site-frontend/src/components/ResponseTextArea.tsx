import * as React from 'react';
import styled from 'styled-components';
import { TextArea, TextAreaProps } from 'grommet';
import theme from './theme';

export interface ResponseTextAreaProps extends TextAreaProps {
    disabled: boolean,
    error: string | null,
}

const ResponseTextArea = (props: ResponseTextAreaProps) => {
    const { error, value, ...restProps } = props;
    return <TextArea {...restProps} value={error || value} />
}

export default styled(ResponseTextArea)`
    color: ${props => props.error ? theme.global.colors.white: ''};
    background-color: ${props => props.error ? theme.global.colors['status-error']: ''};
    opacity: ${props => props.error ? '1' : ''}
`;
