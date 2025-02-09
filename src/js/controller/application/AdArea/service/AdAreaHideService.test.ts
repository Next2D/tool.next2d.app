import { execute } from "./AdAreaHideService";
import { $AD_ID } from "../../../../config/ADConfig";
import { describe, expect, it } from "vitest";

describe("AdAreaHideService Test", () =>
{
    it("test case", () =>
    {
        const div = document.createElement("div");
        div.id = $AD_ID;
        document.body.appendChild(div);

        const style = document.documentElement.style;

        expect(style.getPropertyValue("--ad")).toBe("");
        expect(div.style.display).toBe("");

        execute();

        expect(div.style.display).toBe("none");
        expect(style.getPropertyValue("--ad")).toBe("0px");

        document.body.removeChild(div);
    });
});