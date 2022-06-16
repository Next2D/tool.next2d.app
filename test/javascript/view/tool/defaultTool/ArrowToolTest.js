describe("ArrowTool.js property test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("constructor test", () =>
    {
        const tool = new ArrowTool();
        expect(tool._$name).toBe("arrow");
        expect(Util.$tools.activeTool).toBe(tool);
    });
});
