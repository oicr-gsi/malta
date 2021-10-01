import React from "react";
import {
  DropdownLabel,
  DropdownOption,
  DropdownSelect,
} from "../gammaSelectionStyles";

export const DropdownMenu = (props) => {
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
        <option style={{ display: "none" }}></option>
        {data["data"] ? (
          data["data"].map((option, key) => (
            <>
              <DropdownOption key={key} value={option}>
                {option}
              </DropdownOption>
            </>
          ))
        ) : (
          <></>
        )}
      </DropdownSelect>
    </>
  );
};
