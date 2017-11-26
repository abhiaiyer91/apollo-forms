import React from 'react';

import withInput from '../src/withInput';

export const Input = withInput('input');

export const TextArea = withInput('textarea');

const SelectInput = withInput('select');

export function Select({ options = [], ...rest }) {
  return (
    <SelectInput {...rest}>
      {options.map(({ label, value }, index) => {
        return (
          <option key={`${index}_${label}`} value={value}>
            {label}
          </option>
        );
      })}
    </SelectInput>
  );
}
