import { $CONFIRM_MODAL_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ConfirmModalAllCancelUseCase";
import { describe, expect, it, vi } from "vitest";

describe("ConfirmModalAllCancelUseCase Test", () =>
{
    it("execute test", () =>
    {
        let state = "show";
        const mockMenu = {
            "name": $CONFIRM_MODAL_NAME,
            "hide": vi.fn(() => state = "hide")
        };
        $registerMenu(mockMenu);

        expect(state).toBe("show");
        execute();
        expect(state).toBe("hide");
    });
});