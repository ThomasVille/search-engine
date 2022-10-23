import React, { useCallback } from 'react';
import { useSubmit, useSearchParams } from "@remix-run/react";
import { debounce } from 'lodash';

import Typography from '@mui/joy/Typography';
import Slider from '@mui/joy/Slider';

interface Props {
    label: string,
    dbName: string,
    unit: string | undefined,
    defaultValue: number[],
    min: number,
    max: number,
}

export default function RangeFilter({ label, dbName, unit, defaultValue, min, max }: Props) {
  const submit = useSubmit();
    const [searchParams] = useSearchParams();
    const urlValue = searchParams.getAll(dbName);
    const [value, setValue] = React.useState<number[]>(urlValue.length ? urlValue.map(v => +v) : defaultValue);

    const debouncedSubmit = useCallback(
        debounce((target: any, options: any) => submit(target, options), 250),
        [],
    );

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
        debouncedSubmit(document.forms[0], { replace: true });
    };

    function valueText(value: number) {
        if (unit != undefined)
            return `${value}${unit}`;
        else
            return `${value}`;
    }

    return (
        <div>
            <Typography id={dbName+"_group"} level="body1" fontWeight="lg" mb={1} style={{ marginBottom: "2rem" }}>
            {label}
            </Typography>
            <Slider
                name={dbName}
                getAriaLabel={() => label}
                value={value}
                onChange={handleChange}
                valueLabelDisplay="on"
                valueLabelFormat={valueText}
                getAriaValueText={valueText}
                min={min}
                max={max}
            />
        </div>
    );
}
