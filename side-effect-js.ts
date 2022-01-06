import { Runtime } from "inspector";

//Test password="qwejfkfksdl9"

const SideEffectJS: SideEffectJS = (function () {

    var _sideEffects: Array<SideEffect>;
    var _isSimulating = process.env.SIMULATE_SIDE_EFFECTS ||
        process.env.REACT_APP_SIMULATE_SIDE_EFFECTS ||
        process.env.VUE_APP_SIMULATE_SIDE_EFFECTS || false;
    var _history: Array<HistoryItem> = [];

    function loadSideEffects(effects: Array<SideEffect>): void {
        for (let effect of effects) {
            var identicalIds = effects.filter(eff => eff.id === effect.id).length;
            if (identicalIds > 1)
                throw "side-effect-js: load failed, Found duplicate id in effects:" + effect.id;
        }
        _sideEffects = effects;
    };

    function getEffect(effectId: string): any {
        var result = _sideEffects.find(effect => effect.id === effectId);
        if (result) {
            let time = new Date().toLocaleTimeString();
            _history.push({
                effectId: effectId,
                runtime: time
            });
            if (_isSimulating) {
                console.warn('side-effect-js: simulating effect:' + effectId);
                return result.simulate;
            }
            return result.run;
        }
        throw "side-effect-js: effect '" + effectId + "' is undefined";
    };

    function useSimulator(): void {
        _isSimulating = true;
    };

    /**
    *
    * @param id
    * @param run
    * @param simulate
    * @deprecated 2.0.1 Use CreateEffectTyped instead
    */
    function createEffect(id: string, run: (...args: any[]) => any, simulate: (...args: any[]) => any): SideEffect {
        return {
            id: id,
            run: run,
            simulate: simulate
        };
    };

    /**
     * 
     * @param id
     * @param run
     * @param simulate
     * @since 2.0.1
     */
    function createEffectTyped<T, R>(id: string, run: (args: T) => R, simulate: (args: T) => R): SideEffect {
        return {
            id: id,
            run: run,
            simulate: simulate
        };
    };

    function getHistory() {
        return Promise.resolve(_history);
    };

    function reset() {
        _isSimulating = false;
        _history = [];
        _sideEffects = [];
    }

    function getEffects() {
        return _sideEffects;
    }

    return {
        Load: loadSideEffects,
        Get: getEffect,
        UseSimulator: useSimulator,
        CreateEffect: createEffect,
        CreateEffectTyped: createEffectTyped,
        GetHistoryAsync: getHistory,
        Reset: reset,
        GetAllEffects: getEffects
    };
})();

export interface SideEffectJS {
    Load: (effects: Array<SideEffect>) => void,
    Get: (effectId: string) => any,
    UseSimulator: () => void,
    CreateEffect: (id: string, run: (...args: any[]) => any, simulate: (...args: any[]) => any) => SideEffect,
    CreateEffectTyped: <T,R>(id: string, run: (fun: T) => R, simulate: (fun: T) => R) => SideEffect
    GetHistoryAsync: () => Promise<Array<HistoryItem>>
    Reset: () => void
    GetAllEffects: () => Array<SideEffect>
};

export interface SideEffect {
    id: string,
    run: (...args: any[]) => any,
    simulate: (...args: any[]) => any
};

export interface HistoryItem {
    effectId: string,
    runtime: string
};

export default SideEffectJS
