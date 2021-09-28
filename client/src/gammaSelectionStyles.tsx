import { Button } from "react-bootstrap";
import styled from "styled-components";

const lightGreen = "#3cab38";
const darkGreen = "#007400";
const white = "#ffffff";
const black = "#000000";

export const Textbox = styled.input`
  background-color: ${lightGreen};
  font-size: 18px;
  font-weight: 600;
  color: ${white};
  border: none;
  opacity: 0.7;
`;

export const SubmitButton = styled(Button)`
  background-color: ${darkGreen};
  font-size: 18px;
  font-weight: 600;
  color: ${white};
  border: none;
  border-radius: 30px;

  &:hover {
    background-color: ${lightGreen};
  }
`;

export const FormInputLabel = styled.label`
  font-weight: 600;
`;

export const DropdownOption = styled.option`
  &:hover {
    background-color: ${lightGreen};
  }
`;
