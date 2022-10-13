import {fireEvent, render, screen, within} from "@testing-library/react";
import {GenderInput} from "./GenderInput";
import {Gender} from "../../../../data/team/team.model";

describe("GenderInput", () => {
    const onChangeGender = jest.fn()

    function renderComponent() {
        render(<GenderInput gender={Gender.MALE} onChangeGender={onChangeGender}/>)
    }

    it("should test changing the gender", (done) => {
        renderComponent()

        const genderInput = screen.getByTestId("gender-input")

        fireEvent.mouseDown(within(genderInput).getByRole("button"))
        const femaleInput = screen.getByTestId("female-gender-select")
        fireEvent.click(femaleInput)

        expect(onChangeGender).toHaveBeenCalledTimes(1)
        expect(onChangeGender).toHaveBeenCalledWith(Gender.FEMALE)

        done()
    })
})