import { execute } from "./ScreenTabGetListElementService";
import { describe, expect, it } from "vitest";

describe("ScreenTabGetListElementServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = "tab-menu-id-1";
        document.body.appendChild(div);

        expect(execute(0)).toBe(null);
        expect(execute(1)).toBe(div);

        div.remove();
    });
});