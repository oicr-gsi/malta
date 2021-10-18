import React, { Key } from "react";
import { Spinner } from "react-bootstrap";
import {
  DropdownLabel,
  DropdownOption,
  DropdownSelect,
} from "./gammaSelectionStyles";

interface DropdownMenuProps {
  data: String[] | Number[];
  label: String;
  value: String | Number;
  // sets value to a String or Number:
  setValue: any;
}

export const DropdownMenu = (props: DropdownMenuProps) => {
  const { data, label, value, setValue } = props;

  return (
    <>
      <DropdownLabel htmlFor={label}>{label}</DropdownLabel>
      <br />
      <DropdownSelect
        id={label}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setValue(e.target.value);
        }}
      >
        {/* this blank option is needed so the dropdown is empty on page load */}
        <option style={{ display: "none" }}></option>
        {data["data"] ? (
          data["data"].map((option: String | Number, key: Key) => (
            <DropdownOption key={key} value={option}>
              {option}
            </DropdownOption>
          ))
        ) : (
          <Spinner animation="border" variant="success" />
        )}
      </DropdownSelect>
    </>
  );
};
