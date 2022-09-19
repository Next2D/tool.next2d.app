describe("Tool.js property test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("constructor test", () =>
    {
        const tool = new Tool("test");

        const children = document
            .getElementById("plugin-tools")
            .children;

        expect(children.length).toBe(1);
        expect(tool._$name).toBe("test");

        // setCursor
        expect(tool._$cursor).toBe("auto");
        tool.setCursor("abc");
        expect(tool._$cursor).toBe("abc");

        const element = document
            .getElementById("tools-test");
        expect(element.dataset.detail).toBeUndefined();

        tool.setToolTip("tips");
        expect(element.dataset.detail).toBe("tips");
    });
});
