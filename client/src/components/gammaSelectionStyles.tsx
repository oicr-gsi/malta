import { Button, Col, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { Theme } from "../globalStyles";

const { lightGreen, darkGreen, white, black, gray } = Theme;
const fontSize = "18px";

export const Textbox = styled.input`
  background-color: ${lightGreen};
  font-size: ${fontSize};
  font-weight: 600;
  color: ${white};
  border: none;
  opacity: 0.7;
  width: 12.9rem;
`;

// to make boxes more compact
export const FormItemCol = styled(Col)`
  padding-right: 1rem;
`;

export const SubmitButton = styled.button`
  background-color: ${(props: { disabled: boolean }) =>
    props.disabled ? lightGreen : darkGreen};
  opacity: ${(props: { disabled: boolean }) => (props.disabled ? "0.4" : "1")};
  font-size: ${fontSize};
  font-weight: 600;
  width: 180px;
  height: 70%;
  color: ${white};
  border: none;
  border-radius: 30px;
  position: absolute;
  text-align: center;
  top: 35%;
  margin-left: 1.5rem;

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

export const DropdownSelect = styled.select`
  background-color: ${lightGreen};
  color: ${white};
  opacity: 0.7;
  font-size: ${fontSize};
  font-weight: 400;
  margin-bottom: 0.5rem;
`;

export const DropdownOption = styled.option`
  background-color: ${gray};
  color: ${black};
  border-bottom: pink;
  height: 100%;
`;
