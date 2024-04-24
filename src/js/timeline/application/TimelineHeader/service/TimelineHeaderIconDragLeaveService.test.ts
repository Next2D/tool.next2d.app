import { execute } from "./TimelineHeaderIconDragLeaveService";
import {
    $setMoveIconType,
    $setMoveIconFrame
} from "../../TimelineUtil";
import {
    $TIMELINE_HEADER_LABEL_INDEX,
    $TIMELINE_HEADER_SCRIPT_INDEX,
    $TIMELINE_HEADER_SOUND_INDEX
} from "../../../../config/TimelineConfig";

describe("TimelineHeaderIconDragLeaveServiceTest", () =>
{
    test("execute test script", (): void =>
    {
        $setMoveIconType("script");
        $setMoveIconFrame(10);

        const parent = document.createElement("div");
        for (let idx = 0; idx < 5; ++idx) {
            const node = document.createElement("div");
            node.style.backgroundColor = "#3692f0";
            parent.appendChild(node);
        }

        const labelElement  = parent.children[$TIMELINE_HEADER_LABEL_INDEX] as HTMLElement;
        const scriptElement = parent.children[$TIMELINE_HEADER_SCRIPT_INDEX] as HTMLElement;
        const soundElement  = parent.children[$TIMELINE_HEADER_SOUND_INDEX] as HTMLElement;

        const mockEvent = {
            "currentTarget": parent,
            "stopPropagation": () => {},
            "preventDefault": () => {}
        };

        expect(labelElement.style.backgroundColor).toBe("rgb(54, 146, 240)");
        expect(scriptElement.style.backgroundColor).toBe("rgb(54, 146, 240)");
        expect(soundElement.style.backgroundColor).toBe("rgb(54, 146, 240)");

        execute(mockEvent);

        expect(labelElement.style.backgroundColor).toBe("rgb(54, 146, 240)");
        expect(scriptElement.style.backgroundColor).toBe("");
        expect(soundElement.style.backgroundColor).toBe("rgb(54, 146, 240)");
    });

    test("execute test label", (): void =>
    {
        $setMoveIconType("label");
        $setMoveIconFrame(10);

        const parent = document.createElement("div");
        for (let idx = 0; idx < 5; ++idx) {
            const node = document.createElement("div");
            node.style.backgroundColor = "#3692f0";
            parent.appendChild(node);
        }

        const labelElement  = parent.children[$TIMELINE_HEADER_LABEL_INDEX] as HTMLElement;
        const scriptElement = parent.children[$TIMELINE_HEADER_SCRIPT_INDEX] as HTMLElement;
        const soundElement  = parent.children[$TIMELINE_HEADER_SOUND_INDEX] as HTMLElement;

        const mockEvent = {
            "currentTarget": parent,
            "stopPropagation": () => {},
            "preventDefault": () => {}
        };

        expect(labelElement.style.backgroundColor).toBe("rgb(54, 146, 240)");
        expect(scriptElement.style.backgroundColor).toBe("rgb(54, 146, 240)");
        expect(soundElement.style.backgroundColor).toBe("rgb(54, 146, 240)");

        execute(mockEvent);

        expect(labelElement.style.backgroundColor).toBe("");
        expect(scriptElement.style.backgroundColor).toBe("rgb(54, 146, 240)");
        expect(soundElement.style.backgroundColor).toBe("rgb(54, 146, 240)");
    });

    test("execute test sound", (): void =>
    {
        $setMoveIconType("sound");
        $setMoveIconFrame(10);

        const parent = document.createElement("div");
        for (let idx = 0; idx < 5; ++idx) {
            const node = document.createElement("div");
            node.style.backgroundColor = "#3692f0";
            parent.appendChild(node);
        }

        const labelElement  = parent.children[$TIMELINE_HEADER_LABEL_INDEX] as HTMLElement;
        const scriptElement = parent.children[$TIMELINE_HEADER_SCRIPT_INDEX] as HTMLElement;
        const soundElement  = parent.children[$TIMELINE_HEADER_SOUND_INDEX] as HTMLElement;

        const mockEvent = {
            "currentTarget": parent,
            "stopPropagation": () => {},
            "preventDefault": () => {}
        };

        expect(labelElement.style.backgroundColor).toBe("rgb(54, 146, 240)");
        expect(scriptElement.style.backgroundColor).toBe("rgb(54, 146, 240)");
        expect(soundElement.style.backgroundColor).toBe("rgb(54, 146, 240)");

        execute(mockEvent);

        expect(labelElement.style.backgroundColor).toBe("rgb(54, 146, 240)");
        expect(scriptElement.style.backgroundColor).toBe("rgb(54, 146, 240)");
        expect(soundElement.style.backgroundColor).toBe("");
    });
});