describe("Filter.js property test", () =>
{
    it("blurX test", () =>
    {
        const filter = new Filter();

        // 初期値
        expect(filter.blurX).toBe(4);

        // バリデーション
        filter.blurX = -9999;
        expect(filter.blurX).toBe(FilterController.MIN_BLUR);

        filter.blurX = 9999;
        expect(filter.blurX).toBe(FilterController.MAX_BLUR);
    });

    it("blurY test", () =>
    {
        const filter = new Filter();

        // 初期値
        expect(filter.blurY).toBe(4);

        // バリデーション
        filter.blurY = -9999;
        expect(filter.blurY).toBe(FilterController.MIN_BLUR);

        filter.blurY = 9999;
        expect(filter.blurY).toBe(FilterController.MAX_BLUR);
    });

    it("quality test", () =>
    {
        const filter = new Filter();

        // 初期値
        expect(filter.quality).toBe(1);

        // バリデーション
        filter.quality = -9999;
        expect(filter.quality).toBe(1);

        filter.quality = 9999;
        expect(filter.quality).toBe(3);
    });
});
