import { execute } from "./PropertyAreaTitleMouseDownEventService";

describe("PropertyAreaTitleMouseDownEventServiceTest", () =>
{
    test("execute test", () =>
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

        let state = "on";
        const eventMock = {
            "stopPropagation": () =>
            {
                state = "off";
            },
            "currentTarget": parentElement
        };

        expect(state).toBe("on");
        expect(viewAreaElement.style.display).toBe("");
        expect(iconElement.classList.contains("active")).toBe(true);

        // 非表示
        execute(eventMock);
        expect(state).toBe("off");
        expect(viewAreaElement.style.display).toBe("none");
        expect(iconElement.classList.contains("active")).toBe(false);

        // 表示
        execute(eventMock);
        expect(state).toBe("off");
        expect(viewAreaElement.style.display).toBe("");
        expect(iconElement.classList.contains("disable")).toBe(false);

        parentElement.remove();
        viewAreaElement.remove();
    });
});