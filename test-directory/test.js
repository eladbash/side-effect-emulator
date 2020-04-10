//const SideEffectJS = require('side-effect-js');
const SideEffectJS = require('../index.js');
const fetch = require("node-fetch");

// Define effects
var newConsoleEffect = SideEffectJS.CreateEffect('console-effect',
    () => { console.log("X"); },
    () => { console.log("x simulate"); }
);

var fetchEffect = SideEffectJS.CreateEffect('fetch-effect',
    () => { return fetch('http://www.google.com'); },
    () => {
        return new Promise(resolve => setTimeout(() => resolve("google test"), 2000));
    }
);

var sideEffects = [newConsoleEffect, fetchEffect];

// Load effects
SideEffectJS.Load(sideEffects);

// Use simulator mode
SideEffectJS.UseSimulator();

//Execute effects
var consoleEffectResult = SideEffectJS.Get('console-effect');
consoleEffectResult(); //void effect

var fetchEffectResult = SideEffectJS.Get('fetch-effect');
fetchEffectResult().then(res => console.log(res)); //Promise effect

//Get history of executed effects:
SideEffectJS.GetHistoryAsync().then(history => console.log(history));

//Get history using await
async function GetHistory() {
    var history = await SideEffectJS.GetHistoryAsync();
    console.log(history);
}
GetHistory();

