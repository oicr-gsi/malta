import React, { Key } from "react";
import {
  DropdownLabel,
  DropdownOption,
  DropdownSelect,
} from "./gammaSelectionStyles";

interface DropdownMenuProps {
  data: String[] | Number[];
  label: String;
  value: String | Number;
  setValue: any;
}

export const DropdownMenu = (props: DropdownMenuProps) => {
  const { data, label, value, setValue } = props;

  return (
    <>
      <DropdownLabel>{label}</DropdownLabel>
      <br />
      <DropdownSelect
        value={value}
        onChange={(e) => {
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
          <></>
        )}
      </DropdownSelect>
    </>
  );
};
