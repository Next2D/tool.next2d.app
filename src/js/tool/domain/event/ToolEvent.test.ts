import { ToolEvent } from "./ToolEvent";
import { EventType } from "./EventType";
import { $setCursor } from "../../../global/GlobalUtil";

describe("ToolEventTest", () =>
{
    test("property test", () =>
    {
        const object = new ToolEvent("test");
        expect(object.name).toBe("test");
        expect(object.active).toBe(false);
        expect(object.target).toBe(null);
    });

    test("default event test", () =>
    {
        const object = new ToolEvent("test");
        expect(object["_$events"].size).toBe(4);

        // down event
        object.dispatchEvent(EventType.MOUSE_DOWN, {
            "stopPropagation": () => { return null },
            "currentTarget": "element"
        });
        expect(object.active).toBe(true);
        expect(object.target).toBe("element");

        // up event
        object.dispatchEvent(EventType.MOUSE_UP, {
            "stopPropagation": () => { return null },
            "currentTarget": "element"
        });
        expect(object.active).toBe(false);
        expect(object.target).toBe(null);

        // start event
        const div = document.createElement("div");
        div.id = "tools-test";
        div.dataset.mode = "tool";
        document.body.appendChild(div);
        expect(div.classList.contains("active")).toBe(false);

        $setCursor("test");
        expect(document.documentElement.style.getPropertyValue("--tool-cursor")).toBe("test");

        object.dispatchEvent(EventType.START);
        expect(document.documentElement.style.getPropertyValue("--tool-cursor")).toBe("auto");
        expect(div.classList.contains("active")).toBe(true);

        // end event
        $setCursor("test");
        expect(document.documentElement.style.getPropertyValue("--tool-cursor")).toBe("test");

        object.dispatchEvent(EventType.END);
        expect(document.documentElement.style.getPropertyValue("--tool-cursor")).toBe("auto");
        expect(div.classList.contains("active")).toBe(false);

        // fixed logic
        div.remove();
    });
});