import { execute } from "./ScreenMenuAllInactiveService";
import {
    $SCREEN_ALIGN_ID,
    $SCREEN_CHANGE_SCENE_ID,
    $SCREEN_ORDER_ID
} from "@/config/ScreenConfig";
import { describe, expect, it, beforeEach, afterEach } from "vitest";

describe("ScreenMenuAllInactiveServiceTest", () =>
{
    let alignElement: HTMLElement;
    let orderElement: HTMLElement;
    let changeSceneElement: HTMLElement;

    beforeEach(() =>
    {
        alignElement = document.createElement("div");
        alignElement.id = $SCREEN_ALIGN_ID;
        alignElement.setAttribute("style", "");
        document.body.appendChild(alignElement);

        orderElement = document.createElement("div");
        orderElement.id = $SCREEN_ORDER_ID;
        orderElement.setAttribute("style", "");
        document.body.appendChild(orderElement);

        changeSceneElement = document.createElement("div");
        changeSceneElement.id = $SCREEN_CHANGE_SCENE_ID;
        changeSceneElement.setAttribute("style", "");
        document.body.appendChild(changeSceneElement);
    });

    afterEach(() =>
    {
        if (alignElement && document.body.contains(alignElement)) {
            document.body.removeChild(alignElement);
        }
        if (orderElement && document.body.contains(orderElement)) {
            document.body.removeChild(orderElement);
        }
        if (changeSceneElement && document.body.contains(changeSceneElement)) {
            document.body.removeChild(changeSceneElement);
        }
    });

    it("should set opacity to 0.5 and pointer-events to none for all specified elements", () =>
    {
        expect(alignElement.style.opacity).toBe("");
        expect(alignElement.style.pointerEvents).toBe("");
        expect(orderElement.style.opacity).toBe("");
        expect(orderElement.style.pointerEvents).toBe("");
        expect(changeSceneElement.style.opacity).toBe("");
        expect(changeSceneElement.style.pointerEvents).toBe("");

        execute();

        expect(alignElement.style.opacity).toBe("0.5");
        expect(alignElement.style.pointerEvents).toBe("none");
        expect(orderElement.style.opacity).toBe("0.5");
        expect(orderElement.style.pointerEvents).toBe("none");
        expect(changeSceneElement.style.opacity).toBe("0.5");
        expect(changeSceneElement.style.pointerEvents).toBe("none");
    });

    it("should continue when element is not found", () =>
    {
        const tempElement = alignElement;
        document.body.removeChild(alignElement);
        alignElement = null as any;

        expect(() => execute()).not.toThrow();
        expect(orderElement.style.opacity).toBe("0.5");
        expect(changeSceneElement.style.opacity).toBe("0.5");

        alignElement = tempElement;
    });
});
