describe("LayerMode.js property test", () =>
{
    it("NORMAL test", () =>
    {
        expect(LayerMode.NORMAL).toBe(0);
    });

    it("MASK test", () =>
    {
        expect(LayerMode.MASK).toBe(1);
    });

    it("MASK_IN test", () =>
    {
        expect(LayerMode.MASK_IN).toBe(2);
    });

    it("GUIDE test", () =>
    {
        expect(LayerMode.GUIDE).toBe(3);
    });

    it("GUIDE_IN test", () =>
    {
        expect(LayerMode.GUIDE_IN).toBe(4);
    });
});
