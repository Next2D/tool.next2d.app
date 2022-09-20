describe("BlurFilter.js function test", () =>
{
    it("toParamArray test", () =>
    {
        const blurFilter = new BlurFilter();

        const params = blurFilter.toParamArray();
        expect(params[0]).toBe(null);
        expect(params[1]).toBe(4);
        expect(params[2]).toBe(4);
        expect(params[3]).toBe(1);
    });

    it("toObject test", () =>
    {
        const blurFilter = new BlurFilter();

        const object = blurFilter.toObject();
        expect(object.name).toBe("BlurFilter");
        expect(object.blurX).toBe(4);
        expect(object.blurY).toBe(4);
        expect(object.quality).toBe(1);
        expect(object.state).toBe(true);
    });

});
