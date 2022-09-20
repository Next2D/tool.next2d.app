describe("ToolEvent.js test", () =>
{
    it("constructor test", () =>
    {
        const toolEvent = new ToolEvent();
        expect(toolEvent._$events.has(EventType.MOUSE_DOWN)).toBe(true);
        expect(toolEvent._$events.has(EventType.MOUSE_UP)).toBe(true);
        expect(toolEvent._$events.has(EventType.START)).toBe(true);
        expect(toolEvent._$events.has(EventType.END)).toBe(true);
    });

    it("activation and termination test", () =>
    {
        const toolEvent = new ToolEvent();

        // 初期値
        expect(toolEvent.active).toBe(false);
        expect(toolEvent.target).toBe(null);

        // 関数コール後の変数値
        toolEvent.activation({"currentTarget": "test"});
        expect(toolEvent.active).toBe(true);
        expect(toolEvent.target).toBe("test");

        // 関数コール後の変数値
        toolEvent.termination();
        expect(toolEvent.active).toBe(false);
        expect(toolEvent.target).toBe(null);
    });

});

describe("ToolEvent.js element test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("toolStart and toolEnd test", () =>
    {
        const toolEvent = new ToolEvent();

        const names = [
            "arrow",
            "bucket",
            "circle",
            "pen",
            "rectangle",
            "round-rect",
            "text",
            "transform",
            "zoom"
        ];

        for (let idx = 0; idx < names.length; ++idx) {

            toolEvent._$name = names[idx];

            const element = document
                .getElementById(`tools-${toolEvent._$name}`);

            // 初期値
            expect(element.classList.contains("active")).toBe(false);

            // 関数コール後の変数値
            toolEvent.toolStart();
            expect(element.classList.contains("active")).toBe(true);

            toolEvent.toolEnd();
            expect(element.classList.contains("active")).toBe(false);
        }

    });
});
