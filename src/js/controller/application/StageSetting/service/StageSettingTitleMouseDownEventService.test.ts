import { execute } from "./StageSettingTitleMouseDownEventService";
import { $STAGE_SETTING_TITLE_ID, $STAGE_SETTING_ID } from "../../../../config/StageSettingConfig";

describe("StageSettingTitleMouseDownEventServiceTest", () =>
{
    test("execute test", () =>
    {
        const parentElement = document.createElement("div");
        document.body.appendChild(parentElement);
        parentElement.id = $STAGE_SETTING_TITLE_ID;

        const iconElement = document.createElement("div");
        parentElement.appendChild(iconElement);
        iconElement.setAttribute("class", "active");

        const areaElement = document.createElement("div");
        document.body.appendChild(areaElement);
        areaElement.id = `${$STAGE_SETTING_ID}-view-area`;
        areaElement.style.display = "";

        let state = "on";
        const eventMock = {
            "stopPropagation": () =>
            {
                state = "off";
            }
        };

        expect(state).toBe("on");
        expect(areaElement.style.display).toBe("");
        expect(iconElement.classList.contains("active")).toBe(true);

        // 非表示
        execute(eventMock);
        expect(state).toBe("off");
        expect(areaElement.style.display).toBe("none");
        expect(iconElement.classList.contains("active")).toBe(false);

        // 表示
        execute(eventMock);
        expect(state).toBe("off");
        expect(areaElement.style.display).toBe("");
        expect(iconElement.classList.contains("disable")).toBe(false);

        parentElement.remove();
        areaElement.remove();
    });
});