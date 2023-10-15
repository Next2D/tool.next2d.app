import { execute } from "./ScreenStagePositionCenter";

describe("ScreenStagePositionCenterTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = "screen";
        document.body.appendChild(div);

        const element: HTMLElement | null = document
            .getElementById("screen");

        if (!element) {
            throw new Error("not found screen element");
        }

        expect(element.scrollLeft).toBe(0);
        expect(element.scrollTop).toBe(0);

        const stageMock = {
            "width": 100,
            "height": 200
        };

        element.style.width  = `${stageMock.width}px`;
        element.style.height = `${stageMock.height}px`;

        execute(stageMock);

        expect(element.scrollLeft).toBe(50);
        expect(element.scrollTop).toBe(100);

        div.remove();
    });
});