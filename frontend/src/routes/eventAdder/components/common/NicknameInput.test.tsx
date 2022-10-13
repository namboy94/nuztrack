import {fireEvent, render, screen, within} from "@testing-library/react";
import {NicknameInput} from "./NicknameInput";

describe("NicknameInput", () => {

    const onChangeNickname = jest.fn()

    function renderComponent() {
        render(<NicknameInput nickname={"Nick"} onChangeNickname={onChangeNickname}/>)
    }

    it("should test changing nickname", () => {
        renderComponent()
        const nicknameInput = screen.getByTestId("nickname-input")

        fireEvent.change(within(nicknameInput).getByRole("textbox", {hidden: true}), {target: {value: "Test"}})

        expect(onChangeNickname).toHaveBeenCalledTimes(1)
        expect(onChangeNickname).toHaveBeenCalledWith("Test")
    })
})