import SideEffectJS from '../side-effect-js';

describe('SideEffectJS - Load function tests', () => {
    beforeEach(() => {
        SideEffectJS.Reset();
    });

    it('Should load 3 side effects', () => {
        //Arrange
        const sideEffects = [
            SideEffectJS.CreateEffect('id1', () => { }, () => { }),
            SideEffectJS.CreateEffect('id2', () => { }, () => { }),
            SideEffectJS.CreateEffect('id3', () => { }, () => { }),
        ];

        //Act
        SideEffectJS.Load(sideEffects);
        const allEffects = SideEffectJS.GetAllEffects();

        //Assert
        expect(allEffects.length).toBe(sideEffects.length);
    });

    it('Should throw when loading effects with the same id', () => {
        //Arrange
        const duplicateId = 'duplicate-id';
        const sideEffects = [
            SideEffectJS.CreateEffect(duplicateId, () => { }, () => { }),
            SideEffectJS.CreateEffect(duplicateId, () => { }, () => { })
        ];

        //Act + Assert
        expect(() => SideEffectJS.Load(sideEffects)).toThrow("side-effect-js: load failed, Found duplicate id in effects:" + duplicateId);
       
    });
});

describe('SideEffectJS - UseSimulator tests', () => {
    beforeEach(() => {
        SideEffectJS.Reset();
    });

    it('Should return the simulate value and not the real value when using UseSimulator', () => {
        //Arange
        const fakeValue = "this-is-fake";
        const realValue = "this-is-real";

        const sideEffects = [
            SideEffectJS.CreateEffect('effect1', ()=>realValue, ()=>fakeValue)
        ];

        SideEffectJS.Load(sideEffects);

        //Act
        SideEffectJS.UseSimulator(); //ask to operate in simulate mode
        const returnedValue = SideEffectJS.Get('effect1')();

        //Assert
        expect(returnedValue).toEqual(fakeValue);
    });

    it('Should return the real value and not the fake value when not using UseSimulator', () => {
        //Arange
        const fakeValue = "this-is-fake";
        const realValue = "this-is-real";

        const sideEffects = [
            SideEffectJS.CreateEffect('effect1', () => realValue, () => fakeValue)
        ];

        SideEffectJS.Load(sideEffects);

        //Act
        const returnedValue = SideEffectJS.Get('effect1')();

        //Assert
        expect(returnedValue).toEqual(realValue);
    });
});