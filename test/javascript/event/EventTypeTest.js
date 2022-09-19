describe("EventType.js property test", () =>
{
    it("MOUSE_DOWN test", () =>
    {
        expect(EventType.MOUSE_DOWN).toBe("mousedown");
    });

    it("MOUSE_UP test", () =>
    {
        expect(EventType.MOUSE_UP).toBe("mouseup");
    });

    it("MOUSE_MOVE test", () =>
    {
        expect(EventType.MOUSE_MOVE).toBe("mousemove");
    });

    it("START test", () =>
    {
        expect(EventType.START).toBe("start");
    });

    it("END test", () =>
    {
        expect(EventType.END).toBe("end");
    });

    it("DBL_CLICK test", () =>
    {
        expect(EventType.DBL_CLICK).toBe("dblclick");
    });

    it("CHANGE test", () =>
    {
        expect(EventType.CHANGE).toBe("change");
    });

    it("MOUSE_OVER test", () =>
    {
        expect(EventType.MOUSE_OVER).toBe("mouseover");
    });

    it("MOUSE_OUT test", () =>
    {
        expect(EventType.MOUSE_OUT).toBe("mouseout");
    });

    it("MOUSE_OUT test", () =>
    {
        expect(EventType.KEY_DOWN).toBe("keydown");
    });

    it("MOUSE_OUT test", () =>
    {
        expect(EventType.MOUSE_LEAVE).toBe("mouseleave");
    });
});
