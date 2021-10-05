import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { GammaSelection } from '../gammaSelection';

test("submit button is disabled on initial render", () => {
    render(<GammaSelection/>);
    const submitButton = screen.getByRole("button")
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveTextContent(/submit/i)
    expect(submitButton).toBeDisabled()
});

test("submit button is enabled after cellularity and ploidy are entered", () => {
    render(<GammaSelection/>);
    const submitButton = screen.getByRole("button")
    const cellularityInput = screen.getByLabelText(/cellularity/i)
    const ploidyInput = screen.getByLabelText(/ploidy/i)
    
    userEvent.type(cellularityInput, "0.31")
    userEvent.type(ploidyInput, "2.8")

    expect(submitButton).toBeEnabled()
})