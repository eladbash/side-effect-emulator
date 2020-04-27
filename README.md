![](https://github.com/eladbash/side-effect-emulator/blob/master/logo.png)
# Side Effect JS ![side-effect-js CI](https://github.com/eladbash/side-effect-emulator/workflows/side-effect-js%20CI/badge.svg)
Easy to setup and use - 3 lines of configuration and you can test your single page application like it's really connected to an API / Writes to files etc.

## Version:
* V2.1.0

## How to use:
* Install `side-effect-js` from npm : `npm install side-effect-js --save`
* Create side effects file - the name is not important and export an array of side effects:
	```javascript
		//side-effects-my-app.js
		import SideEffectJS from 'side-effect-js';
		var newConsoleEffect = SideEffectJS.CreateEffect('console-effect',
			() => { console.log("this is the real x"); },
			() => { console.log("x simulate"); }
		);

		var fetchEffect = SideEffectJS.CreateEffect('fetch-effect',
			() => { return fetch('http://www.google.com'); },
			() => {
				return new Promise(resolve => setTimeout(() => resolve("google test"), 2000));
			}
		);

		export default [newConsoleEffect, fetchEffect];
	```
	**Note**: side effect is an object that must contain: id: string, run: func, simulate: func - id is unique, defining duplicate ids will throw an error `SideffectsJS load failed, Found duplicate id in effects:$id` on load.
	

* On the root of your app - load all side effects to **SideEffectJS**:
	```javascript
		//App.js or index.js
		import sideEffects from './side-effects-my-app.js'
		import SideEffectJS from 'side-effect-js';
		SideEffectJS.Load(sideEffects);
	```

* When you want to use the `simulate` effect - just add after `SideEffectJS.Load` this line: `SideEffectJS.UseSimulator();
`

	 **Don't use** `SideEffectJS.UseSimulator()` on production.
#### Better way to run in simulator mode without Changing the code (v2.0.0+)
**Old way (changing code):**
In versions previous to 2.0.0 when you wanted to use the mock side effects you should call `SideEffectJS.UseSimulator();` in your code.
You can still do it - but then you need to change this line all the time.<br/>
**New way (use process.env):**
All you need to do is to initiate `SIMULATE_SIDE_EFFECTS=1` and you will get the mock effects.<br/>
For example instead of using: `node index.js` run: `SIMULATE_SIDE_EFFECTS=1 node index.js`.
For **react** applications using CRA (create react app) - you can use `REACT_APP_SIMULATE_SIDE_EFFECTS=1` in the `.env` files.


Read more on Create React App .env: <br/> https://create-react-app.dev/docs/adding-custom-environment-variables/

* Consume effects from **SideEffectJS**: 
	```javascript
		import SideEffectJS from 'side-effect-js';
		var effect = SideEffectJS.Get('fetch-effect');
		effect().then(x => console.log(x));
	```
## What do you need it for?
If you are developing single page application (Frontend) or Node.js apps (Backend) - most of the times you will have a server that returns responses to your client.

Almost any application has side effects:

* Using AJAX to call remote servers (Your REST API / Firebase or other serverless).
* Reading / Writing to files (on the server side)

In order to mock those I/O operations - you need to change your code frequently - means you should replace those I/O with some "stub" code.

So - what can we do better?

### Use the side-effect method
Write all side effects in some aggregated place and load real / stub behaviour on run time.

#### Example:

Let's assume we are using **redux-thunk** or **redux-saga** and we need to fetch some data.
What will we do with this data? save it to the state - and baiscally it will cause the UI to re-render and display something. 

So instead of using this example thunk we will use the side-effects approach:
```javascript
//some-redux-thunk-example

const myThunk = (username, password) => {
	dispatch('LOGIN_STARTED');
	// I.O operation
	fetch('myapi.com/login',
		{
			username:username,
			password:password
		})
		.then(token => dispatch('LOGIN_SUCCESS', token)
		.catch(err => dispatch('LOGIN_FAILED', err);
}
```

This is how it will look when using **Side Effect JS**:
```javascript
//some-redux-thunk-example

import SideEffectJS from 'side-effect-js';

const myThunk = (username, password) => {
	dispatch('LOGIN_STARTED');
	// I.O operation
	SideEffectJS.Get('login')(username, password)
		.then(token => dispatch('LOGIN_SUCCESS', token)
		.catch(err => dispatch('LOGIN_FAILED', err);
}
```

What are the benefits of this approach?

* You are aware of IO - because you define side effect for each operation.
* You can mock and stub any i/o operation - and work on real app like it's consuming data from an API.
* You don't need to handle mock api and configure it all the time.
* You have one place that holds all the side effects of your app (in DDD terms it enfources infrastructure layer)
* You app will be easier to test 
* By creating the side effects file you are creating documentations for you app's side effects.

### What's next?
In the next versions there will be full support for:

1. Display all the side effects that your application actually uses in real time.
2. Better documentations & Examples.
3. Support for middlewares - so you will be able implement anything you want.

## Release notes:
**V2.1.0:** - *04/27/2020* <br/>
*`Deprecated (ts only):`*<br/>
For TypeScript only - `CreateEffect` is deprecated (backward compatible), instead use: `CreateEffectTyped`.
Typescript usage example:
```typescript
//Example.ts
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
```

**V2.0.0:** - *04/26/2020* <br/>
Instead of using `SideEffectJS.UseSimulator()` - which forces you to change code -> use `SIMULATE_SIDE_EFFECTS=1` or `REACT_APP_SIMULATE_SIDE_EFFECTS=1` for CRA apps.
`SideEffectJS.UseSimulator()` is still an option but it forces you to change code before merging.
Read more on Create React App .env: <br/> https://create-react-app.dev/docs/adding-custom-environment-variables/


