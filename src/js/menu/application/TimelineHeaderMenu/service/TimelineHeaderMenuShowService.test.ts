import { $TIMELINE_HEADER_MENU_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./TimelineHeaderMenuShowService";

describe("TimelineHeaderMenuShowServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $TIMELINE_HEADER_MENU_NAME;
        document.body.appendChild(div);

        let state = "hide";
        const mockMenu = {
            "name": $TIMELINE_HEADER_MENU_NAME,
            "show": () =>
            {
                state = "show";
            }
        };
        $registerMenu(mockMenu);

        let stop = false;
        let preventDefault = false;
        const eventMock = {
            "stopPropagation": () =>
            {
                stop = true;
            },
            "preventDefault": () =>
            {
                preventDefault = true;
            }
        };

        expect(stop).toBe(false);
        expect(preventDefault).toBe(false);
        expect(state).toBe("hide");

        execute(eventMock);

        expect(stop).toBe(true);
        expect(preventDefault).toBe(true);
        expect(state).toBe("show");

        div.remove();
    });
});