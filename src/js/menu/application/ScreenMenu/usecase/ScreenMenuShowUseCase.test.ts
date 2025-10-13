import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { $SCREEN_MENU_NAME } from "../../../../config/MenuConfig";

const {
    mock$getCurrentWorkSpace,
    mock$useKeyboard,
    mock$setEditingElement,
    mock$allHideMenu,
    mock$getMenu,
    mock$registerMenu,
    mockTimelineHeader,
    mockTimelineToolPlayStopUseCase,
    mockScreenMenuUpdateActiveElementUseCase
} = vi.hoisted(() => {
    return {
        mock$getCurrentWorkSpace: vi.fn(),
        mock$useKeyboard: vi.fn(),
        mock$setEditingElement: vi.fn(),
        mock$allHideMenu: vi.fn(),
        mock$getMenu: vi.fn(),
        mock$registerMenu: vi.fn(),
        mockTimelineHeader: { stopFlag: true },
        mockTimelineToolPlayStopUseCase: vi.fn(),
        mockScreenMenuUpdateActiveElementUseCase: vi.fn()
    };
});

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mock$getCurrentWorkSpace
}));

vi.mock("@/shortcut/ShortcutUtil", () => ({
    $useKeyboard: mock$useKeyboard
}));

vi.mock("@/global/GlobalUtil", () => ({
    $setEditingElement: mock$setEditingElement
}));

vi.mock("@/menu/application/MenuUtil", () => ({
    $allHideMenu: mock$allHideMenu,
    $getMenu: mock$getMenu,
    $registerMenu: mock$registerMenu
}));

vi.mock("@/timeline/domain/model/TimelineHeader", () => ({
    timelineHeader: mockTimelineHeader
}));

vi.mock("@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase", () => ({
    execute: mockTimelineToolPlayStopUseCase
}));

vi.mock("./ScreenMenuUpdateActiveElementUseCase", () => ({
    execute: mockScreenMenuUpdateActiveElementUseCase
}));

import { execute } from "./ScreenMenuShowUseCase";

describe("ScreenMenuShowUseCase Test", () =>
{
    let mockWorkSpace: any;
    let mockMovieClip: any;
    
    beforeEach(() => {
        vi.clearAllMocks();
        
        // Setup workspace mock
        mockMovieClip = {
            selectedDepths: new Map()
        };
        
        mockWorkSpace = {
            scene: mockMovieClip
        };
        
        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mock$useKeyboard.mockReturnValue(false);
    });
    
    afterEach(() => {
        vi.resetAllMocks();
    });
    
    it("execute test", () =>
    {
        let prevent = true;
        let state = "on";
        const eventMock = {
            "pageX": 200,
            "pageY": 100,
            "stopPropagation": () =>
            {
                state = "off";
            },
            "preventDefault": () =>
            {
                prevent = false;
            }
        };

        let screenState = "hide";
        const screenMenuMock = {
            "name": $SCREEN_MENU_NAME,
            "offsetLeft": 0,
            "offsetTop": 0,
            "hide": () =>
            {
                screenState = "hide";
            },
            "show": () =>
            {
                screenState = "show";
            }
        };
        
        mock$getMenu.mockReturnValue(screenMenuMock);

        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $SCREEN_MENU_NAME;

        expect(screenMenuMock.offsetLeft).toBe(0);
        expect(screenMenuMock.offsetTop).toBe(0);
        expect(screenState).toBe("hide");
        expect(prevent).toBe(true);
        expect(state).toBe("on");

        execute(eventMock as any);

        expect(mock$setEditingElement).toHaveBeenCalledWith(null);
        expect(mock$allHideMenu).toHaveBeenCalledWith($SCREEN_MENU_NAME);
        expect(mockScreenMenuUpdateActiveElementUseCase).toHaveBeenCalled();
        expect(screenMenuMock.offsetLeft).toBe(215);
        expect(screenMenuMock.offsetTop).toBe(100);
        expect(screenState).toBe("show");
        expect(prevent).toBe(false);
        expect(state).toBe("off");

        div.remove();
    });
});