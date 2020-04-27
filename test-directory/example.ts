import SideEffectJS from '../side-effect-js';
type GetValue = {
    username: string,
    passowrd: string
}

const exampleFunctionReal = (loginDetails: GetValue): string => {
    return "real";
}

const exampleFunctionMock = (loginDetails: GetValue): string => {
    return "mock";
}

//Old way of creating effect
const oldEffect = SideEffectJS.CreateEffect('id-old', exampleFunctionReal, exampleFunctionMock);

//New way of creating effect(V2.1.0+) - ensures real effect and mock effect has the same contract
const effect = SideEffectJS.CreateEffectTyped<GetValue, string>('xxx', exampleFunctionReal, exampleFunctionMock);



