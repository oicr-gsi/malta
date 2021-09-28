import { Button } from "react-bootstrap";
import styled from "styled-components";
import { Theme } from "./globalStyles";

const { lightGreen, darkGreen, white, black, gray } = Theme;

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
  width: 180px;
  color: ${white};
  border: none;
  border-radius: 30px;
  position: absolute;
  text-align: center;

  top: 35%;
  &:hover {
    background-color: ${lightGreen};
  }
`;

export const FormInputLabel = styled.label`
  font-weight: 600;
  margin-right: 80%;
`;

export const DropdownLabel = styled(FormInputLabel)`
  margin-right: 0;
  text-align: center;
`;

export const Dropdown = styled.select`
  background-color: ${darkGreen};
  color: ${white};
  opacity: 0.7;
  font-size: 18px;
  font-weight: 400;
`;

export const DropdownOption = styled.option`
  background-color: ${gray};
  color: ${black};
  border-bottom: pink;
  height: 100%;
`;
