import { $SCREEN_SCALE_ID } from "../../../../config/ToolConfig";
import { execute } from "./ZoomToolUpdateElementService";

describe("ZoomToolUpdateElementServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const input = document.createElement("input");
        input.id = $SCREEN_SCALE_ID;
        input.value = "100";
        document.body.appendChild(input);

        expect(input.value).toBe("100");

        execute(200);

        expect(input.value).toBe("200");

        input.remove();
    });
});