import { execute } from "./BillingModelHideService";
import { describe, expect, it, vi } from "vitest";
import { $registerMenu } from "../../MenuUtil";
import { $BILLING_MODAL_NAME } from "../../../../config/MenuConfig";

describe("BillingModelHideService Test", () =>
{
    it("execute test", () =>
    {
        let state = "show";
        const mockMenu = {
            "name": $BILLING_MODAL_NAME,
            "hide": vi.fn(() => state = "hide")
        };
        $registerMenu(mockMenu);

        expect(state).toBe("show");
        execute();
        expect(state).toBe("hide");
    });
});