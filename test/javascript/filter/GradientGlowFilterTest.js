describe("GradientGlowFilter.js property test", () =>
{
    it("distance test", () =>
    {
        const gradientGlowFilter = new GradientGlowFilter();

        // 初期値
        expect(gradientGlowFilter.distance).toBe(4);

        // バリデーション
        gradientGlowFilter.distance = -9999;
        expect(gradientGlowFilter.distance).toBe(FilterController.MIN_DISTANCE);

        gradientGlowFilter.distance = 9999;
        expect(gradientGlowFilter.distance).toBe(FilterController.MAX_DISTANCE);
    });

    it("angle test", () =>
    {
        const gradientGlowFilter = new GradientGlowFilter();

        // 初期値
        expect(gradientGlowFilter.angle).toBe(45);

        // バリデーション
        gradientGlowFilter.angle = -900;
        expect(gradientGlowFilter.angle).toBe(-900 % 360);

        gradientGlowFilter.angle = 900;
        expect(gradientGlowFilter.angle).toBe(900 % 360);
    });

    it("colors test", () =>
    {
        const gradientGlowFilter = new GradientGlowFilter();

        // 初期値
        expect(gradientGlowFilter.colors.length).toBe(3);

        const colors = [0xff00ff, 0x00ffff, 0xffff00];
        gradientGlowFilter.colors = colors;
        for (let idx = 0; idx < colors.length; ++idx) {
            expect(gradientGlowFilter.colors[idx]).toBe(colors[idx]);
        }
    });

    it("alphas test", () =>
    {
        const gradientGlowFilter = new GradientGlowFilter();

        // 初期値
        expect(gradientGlowFilter.alphas.length).toBe(3);

        const alphas = [0.2, 0.5, 0.8];
        gradientGlowFilter.alphas = alphas;
        for (let idx = 0; idx < alphas.length; ++idx) {
            expect(gradientGlowFilter.alphas[idx]).toBe(alphas[idx] * 100);
        }
    });

    it("alphas test", () =>
    {
        const gradientGlowFilter = new GradientGlowFilter();

        // 初期値
        expect(gradientGlowFilter.ratios.length).toBe(3);

        const ratios = [50 / 255, 100 / 255, 200 / 255];
        gradientGlowFilter.ratios = ratios;
        for (let idx = 0; idx < ratios.length; ++idx) {
            expect(gradientGlowFilter.ratios[idx]).toBe(ratios[idx] * 255);
        }
    });

    it("strength test", () =>
    {
        const gradientGlowFilter = new GradientGlowFilter();

        // 初期値
        expect(gradientGlowFilter.strength).toBe(1);

        // バリデーション
        gradientGlowFilter.strength = -900;
        expect(gradientGlowFilter.strength).toBe(FilterController.MIN_STRENGTH);

        gradientGlowFilter.strength = 0xffff;
        expect(gradientGlowFilter.strength).toBe(FilterController.MAX_STRENGTH);
    });

    it("type test", () =>
    {
        const gradientGlowFilter = new GradientGlowFilter();

        // 初期値
        expect(gradientGlowFilter.type).toBe("inner");

        // バリデーション
        gradientGlowFilter.type = "FULL";
        expect(gradientGlowFilter.type).toBe("full");

        gradientGlowFilter.type = "inNER";
        expect(gradientGlowFilter.type).toBe("inner");

        gradientGlowFilter.type = "oUTer";
        expect(gradientGlowFilter.type).toBe("outer");

        gradientGlowFilter.type = "aaaa";
        expect(gradientGlowFilter.type).toBe("inner");
    });

    it("knockout test", () =>
    {
        const gradientGlowFilter = new GradientGlowFilter();

        // 初期値
        expect(gradientGlowFilter.knockout).toBe(false);

        // バリデーション
        gradientGlowFilter.knockout = true;
        expect(gradientGlowFilter.knockout).toBe(true);

        gradientGlowFilter.knockout = 0;
        expect(gradientGlowFilter.knockout).toBe(false);
    });
});

describe("BevelFilter.js function test", () =>
{
    it("toParamArray test", () =>
    {
        const gradientGlowFilter = new GradientGlowFilter();

        const params = gradientGlowFilter.toParamArray();
        expect(params[0]).toBe(null);
        expect(params[1]).toBe(4);
        expect(params[2]).toBe(45);
        expect(params[3].length).toBe(3);
        expect(params[4].length).toBe(3);
        expect(params[5].length).toBe(3);
        expect(params[6]).toBe(4);
        expect(params[7]).toBe(4);
        expect(params[8]).toBe(1);
        expect(params[9]).toBe(1);
        expect(params[10]).toBe("inner");
        expect(params[11]).toBe(false);
    });

    it("toObject test", () =>
    {
        const gradientGlowFilter = new GradientGlowFilter();

        const object = gradientGlowFilter.toObject();
        expect(object.name).toBe("GradientGlowFilter");
        expect(object.blurX).toBe(4);
        expect(object.blurY).toBe(4);
        expect(object.quality).toBe(1);
        expect(object.state).toBe(true);
        expect(object.distance).toBe(4);
        expect(object.angle).toBe(45);
        expect(object.strength).toBe(1);
        expect(object.colors.length).toBe(3);
        expect(object.alphas.length).toBe(3);
        expect(object.ratios.length).toBe(3);
        expect(object.type).toBe("inner");
        expect(object.knockout).toBe(false);
    });

});
