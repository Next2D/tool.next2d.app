import { execute } from "./PropertyAreaTitlePointerDownEventUseCase";
import { describe, expect, it, vi } from "vitest";

describe("PropertyAreaTitlePointerDownEventUseCase Test", () =>
{
    it("execute test", () =>
    {
        const parentElement = document.createElement("div");
        document.body.appendChild(parentElement);
        parentElement.dataset.settingName = "stage";

        const iconElement = document.createElement("i");
        parentElement.appendChild(iconElement);
        iconElement.setAttribute("class", "active");

        const viewAreaElement = document.createElement("div");
        document.body.appendChild(viewAreaElement);
        viewAreaElement.id = "stage-setting-view-area";
        viewAreaElement.style.display = "";

        let stopPropagation = false;
        let preventDefault = false;
        const eventMock = {
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
            "preventDefault": vi.fn(() =>
            {
                preventDefault = true;
            }),
            "currentTarget": parentElement
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(viewAreaElement.style.display).toBe("");
        expect(iconElement.classList.contains("active")).toBe(true);

        // 非表示
        execute(eventMock);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(viewAreaElement.style.display).toBe("none");
        expect(iconElement.classList.contains("active")).toBe(false);

        // 表示
        execute(eventMock);
        expect(viewAreaElement.style.display).toBe("");
        expect(iconElement.classList.contains("disable")).toBe(false);

        parentElement.remove();
        viewAreaElement.remove();
    });
});