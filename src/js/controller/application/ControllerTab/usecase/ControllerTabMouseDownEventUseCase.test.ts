import { execute } from "./ControllerTabMouseDownEventUseCase";
import { $CONTROLLER_TAB_AREA_ID } from "../../../../config/ControllerConfig";
import { describe, expect, it, vi } from "vitest";

describe("ControllerTabMouseDownEventUseCase Test", () =>
{
    it("test case", () =>
    {
        const div = document.createElement("div");
        div.id = $CONTROLLER_TAB_AREA_ID;

        const node = document.createElement("div");
        node.classList.add("disable");
        node.dataset.tabType = "test";
        div.appendChild(node);

        const bodyElement = document.createElement("div");
        bodyElement.id = "test";
        bodyElement.style.display = "none";
        document.body.appendChild(bodyElement);
        document.body.appendChild(div);

        let stopPropagation = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
            "button": 0,
            "currentTarget": node,
        } as unknown as PointerEvent;

        expect(node.classList.contains("active")).toBe(false);
        expect(stopPropagation).toBe(false);
        expect(bodyElement.style.display).toBe("none");
        execute(mockEvent);
        expect(node.classList.contains("active")).toBe(true);
        expect(stopPropagation).toBe(true);
        expect(bodyElement.style.display).toBe("");

        document.body.removeChild(div);
        document.body.removeChild(bodyElement);
    });
});