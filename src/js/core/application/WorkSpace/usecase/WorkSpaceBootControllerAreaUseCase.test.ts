import { execute } from "./WorkSpaceBootControllerAreaUseCase";
import { describe, expect, it } from "vitest";
import type { IUserControllerAreaStateObject } from "../../../../interface/IUserControllerAreaStateObject";


describe("WorkSpaceBootControllerAreaUseCase Test", () =>
{
    it("execute test", () =>
    {
        const object: IUserControllerAreaStateObject = {
            "width": 100
        };

        const style = document
            .documentElement
            .style;

        style.setProperty("--controller-width", "");
        expect(style.getPropertyValue("--controller-width")).toBe("");
        execute(object);
        expect(style.getPropertyValue("--controller-width")).toBe(`${object.width}px`);
    });
});