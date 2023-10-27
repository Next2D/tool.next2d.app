import { execute } from "./ScreenTabRemoveElementService";
import { execute as screenTabGetElementService } from "./ScreenTabGetElementService";
import { execute as screenTabGetListElementService } from "./ScreenTabGetListElementService";

describe("ScreenTabRemoveElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const tabDiv = document.createElement("div");
        tabDiv.id = "tab-id-1";
        document.body.appendChild(tabDiv);

        const tabNameDiv = document.createElement("div");
        tabNameDiv.id = "tab-menu-id-1";
        document.body.appendChild(tabNameDiv);

        expect(screenTabGetElementService(1)).toBe(tabDiv);
        expect(screenTabGetListElementService(1)).toBe(tabNameDiv);
        execute(1);
        expect(screenTabGetElementService(1)).toBe(null);
        expect(screenTabGetListElementService(1)).toBe(null);

        tabDiv.remove();
        tabNameDiv.remove();
    });
});