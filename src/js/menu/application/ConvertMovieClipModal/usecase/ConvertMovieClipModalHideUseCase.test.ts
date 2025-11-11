import { execute } from "./ConvertMovieClipModalHideUseCase";
import { $CONVERT_MOVIE_CLIP_MODAL_NAME } from "@/config/MenuConfig";
import { $getMenu } from "../../MenuUtil";
import { $CONVERT_MOVIE_CLIP_INPUT_ID } from "@/config/ConvertMovieClipConfig";
import { $resetState } from "../ConvertMovieClipModalUtil";
import { execute as convertMovieClipModalChildInactiveService } from "../service/ConvertMovieClipModalChildInactiveService";
import { execute as convertMovieClipModalUpdateButtonService } from "../service/ConvertMovieClipModalUpdateButtonService";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("../../MenuUtil");
vi.mock("../ConvertMovieClipModalUtil");
vi.mock("../service/ConvertMovieClipModalChildInactiveService");
vi.mock("../service/ConvertMovieClipModalUpdateButtonService");

describe("ConvertMovieClipModalHideUseCase", () =>
{
    let mockInput: HTMLInputElement;
    let mockMenu: any;

    beforeEach(() =>
    {
        vi.clearAllMocks();
        
        mockInput = document.createElement("input");
        mockInput.id = $CONVERT_MOVIE_CLIP_INPUT_ID;
        mockInput.value = "test value";
        document.body.appendChild(mockInput);

        mockMenu = {
            hide: vi.fn()
        };

        vi.mocked($getMenu).mockReturnValue(mockMenu);
    });

    afterEach(() =>
    {
        document.body.innerHTML = "";
    });

    it("should hide modal and reset state", () =>
    {
        execute();

        expect($getMenu).toHaveBeenCalledWith($CONVERT_MOVIE_CLIP_MODAL_NAME);
        expect(convertMovieClipModalChildInactiveService).toHaveBeenCalled();
        expect(mockInput.value).toBe("");
        expect($resetState).toHaveBeenCalled();
        expect(convertMovieClipModalUpdateButtonService).toHaveBeenCalled();
        expect(mockMenu.hide).toHaveBeenCalled();
    });

    it("should return early when menu not found", () =>
    {
        vi.mocked($getMenu).mockReturnValue(null);

        execute();

        expect($getMenu).toHaveBeenCalledWith($CONVERT_MOVIE_CLIP_MODAL_NAME);
        expect(convertMovieClipModalChildInactiveService).not.toHaveBeenCalled();
        expect($resetState).not.toHaveBeenCalled();
        expect(mockMenu.hide).not.toHaveBeenCalled();
    });

    it("should return early when input element not found", () =>
    {
        document.body.innerHTML = "";

        execute();

        expect($getMenu).toHaveBeenCalledWith($CONVERT_MOVIE_CLIP_MODAL_NAME);
        expect(convertMovieClipModalChildInactiveService).not.toHaveBeenCalled();
        expect($resetState).not.toHaveBeenCalled();
        expect(mockMenu.hide).not.toHaveBeenCalled();
    });

    it("should clear input value", () =>
    {
        mockInput.value = "some text";

        execute();

        expect(mockInput.value).toBe("");
    });

    it("should call all cleanup functions in order", () =>
    {
        const callOrder: string[] = [];

        vi.mocked(convertMovieClipModalChildInactiveService).mockImplementation(() => {
            callOrder.push("childInactive");
        });

        vi.mocked($resetState).mockImplementation(() => {
            callOrder.push("resetState");
        });

        vi.mocked(convertMovieClipModalUpdateButtonService).mockImplementation(() => {
            callOrder.push("updateButton");
        });

        mockMenu.hide.mockImplementation(() => {
            callOrder.push("hide");
        });

        execute();

        expect(callOrder).toEqual([
            "childInactive",
            "resetState",
            "updateButton",
            "hide"
        ]);
    });
});
