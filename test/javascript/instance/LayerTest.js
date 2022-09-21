describe("Layer.js property test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("property test", () =>
    {
        const layer = new Layer();
        expect(layer.id).toBe(0);
    });
});
