import { EventType } from "./EventType";

describe("EventTypeTest", () =>
{
    test("static test", () =>
    {
        expect(EventType.MOUSE_DOWN).toBe("pointerdown");
        expect(EventType.MOUSE_UP).toBe("pointerup");
        expect(EventType.MOUSE_MOVE).toBe("pointermove");
        expect(EventType.START).toBe("start");
        expect(EventType.END).toBe("end");
        expect(EventType.CHANGE).toBe("change");
        expect(EventType.MOUSE_OVER).toBe("pointerover");
        expect(EventType.MOUSE_OUT).toBe("pointerout");
        expect(EventType.KEY_DOWN).toBe("keydown");
        expect(EventType.MOUSE_LEAVE).toBe("pointerleave");
    });
});