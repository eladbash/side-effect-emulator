const SideEffectJS = require('./index');
const fetch = require("node-fetch");

var consoleSideEffect = {
    id: 'console-effect',
    run: function() {
        console.log("x");
    },
    simulate: function() {
        console.log("simulate x");
    }
};

var fetchEffect = {
    id: 'fetch-effect',
    run: () => {
        return fetch('http://www.google.com');
    },
    simulate: () => {
        return Promise.resolve("google test");
    }
};

var sideEffects = [consoleSideEffect, fetchEffect];

SideEffectJS.Load(sideEffects);
SideEffectJS.UseSimulator();
var effect = SideEffectJS.Get('fetch-effect');
effect().then(x => console.log(x));