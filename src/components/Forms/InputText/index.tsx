import React from "react";
import { TextInputProps } from "react-native";

import { Container } from './styles';

type Props = TextInputProps;

export function InputText({...rest} : Props){
    return (
        <Container {...rest} />
    );
}