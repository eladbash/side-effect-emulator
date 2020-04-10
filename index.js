var SideEffectJS = (function() {

    var _sideEffects;
    var _isSimulating = false;

    function loadSideEffects(effects) {
        for (effect in effects) {
            var identicalIds = effects.filter(eff => eff.id === effect.id).length;
            if (identicalIds > 1)
                throw "SideffectsJS load failed, Found duplicate id in effects:" + effect.id;
        }
        _sideEffects = effects;
    }

    function getEffect(effectId) {
        var result = _sideEffects.filter(effect => effect.id === effectId);
        if (result) {
            return _isSimulating ? result[0].simulate : result[0].run;
        }
    }

    function useSimulator() {
        _isSimulating = true;
    }

    return {
        Load: loadSideEffects,
        Get: getEffect,
        UseSimulator: useSimulator
    };
})();

module.exports = SideEffectJS;
