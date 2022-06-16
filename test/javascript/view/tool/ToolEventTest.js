describe("ToolEvent.js property test", () =>
{
    it("constructor test", () =>
    {
        const toolEvent = new ToolEvent();
        expect(toolEvent._$events.size).toBe(4);
        expect(toolEvent._$events.has(EventType.MOUSE_DOWN)).toBeTrue();
        expect(toolEvent._$events.has(EventType.MOUSE_UP)).toBeTrue();
        expect(toolEvent._$events.has(EventType.MOUSE_MOVE)).toBeFalse();
        expect(toolEvent._$events.has(EventType.START)).toBeTrue();
        expect(toolEvent._$events.has(EventType.END)).toBeTrue();
    });
});

describe("ToolEvent.js functions test", () =>
{
    it("addEventListener test", () =>
    {
        const toolEvent = new ToolEvent();

        expect(toolEvent._$events.get(EventType.MOUSE_DOWN).length).toBe(1);
        expect(toolEvent._$events.get(EventType.MOUSE_UP).length).toBe(1);
        expect(toolEvent._$events.get(EventType.START).length).toBe(1);
        expect(toolEvent._$events.get(EventType.END).length).toBe(1);

        toolEvent
            .addEventListener(EventType.MOUSE_DOWN, () =>
            {
                console.log("test");
            });

        toolEvent
            .addEventListener(EventType.MOUSE_UP, () =>
            {
                console.log("test");
            });

        toolEvent
            .addEventListener(EventType.MOUSE_MOVE, () =>
            {
                console.log("test");
            });

        toolEvent
            .addEventListener(EventType.START, () =>
            {
                console.log("test");
            });

        toolEvent
            .addEventListener(EventType.END, () =>
            {
                console.log("test");
            });

        expect(toolEvent._$events.get(EventType.MOUSE_DOWN).length).toBe(2);
        expect(toolEvent._$events.get(EventType.MOUSE_UP).length).toBe(2);
        expect(toolEvent._$events.get(EventType.MOUSE_MOVE).length).toBe(1);
        expect(toolEvent._$events.get(EventType.START).length).toBe(2);
        expect(toolEvent._$events.get(EventType.END).length).toBe(2);
    });

    it("dispatchEvent test", () =>
    {
        const toolEvent = new ToolEvent();

        // 強制的にリセット
        toolEvent._$events.get(EventType.MOUSE_DOWN).length = 0;
        toolEvent._$events.get(EventType.MOUSE_UP).length   = 0;
        toolEvent._$events.get(EventType.START).length      = 0;
        toolEvent._$events.get(EventType.END).length        = 0;

        let ret = null;
        toolEvent
            .addEventListener(EventType.MOUSE_DOWN, () =>
            {
                ret = EventType.MOUSE_DOWN;
            });
        toolEvent.dispatchEvent(EventType.MOUSE_DOWN);
        expect(ret).toBe(EventType.MOUSE_DOWN);

        toolEvent
            .addEventListener(EventType.MOUSE_UP, () =>
            {
                ret = EventType.MOUSE_UP;
            });
        toolEvent.dispatchEvent(EventType.MOUSE_UP);
        expect(ret).toBe(EventType.MOUSE_UP);

        toolEvent
            .addEventListener(EventType.MOUSE_MOVE, () =>
            {
                ret = EventType.MOUSE_MOVE;
            });
        toolEvent.dispatchEvent(EventType.MOUSE_MOVE);
        expect(ret).toBe(EventType.MOUSE_MOVE);

        toolEvent
            .addEventListener(EventType.START, () =>
            {
                ret = EventType.START;
            });
        toolEvent.dispatchEvent(EventType.START);
        expect(ret).toBe(EventType.START);

        toolEvent
            .addEventListener(EventType.END, () =>
            {
                ret = EventType.END;
            });
        toolEvent.dispatchEvent(EventType.END);
        expect(ret).toBe(EventType.END);

    });

});
