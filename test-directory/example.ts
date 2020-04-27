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

const effect = SideEffectJS.CreateEffectTyped<GetValue, string>('xxx', exampleFunctionReal, exampleFunctionMock);



