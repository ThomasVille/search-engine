import React, { useCallback } from 'react';
import { useSubmit, useSearchParams } from "@remix-run/react";
import { debounce } from 'lodash';

import Typography from '@mui/joy/Typography';
import Slider from '@mui/joy/Slider';
import { getDefaultRangeValue, RangeFilter } from '~/models/bikes';

interface Props {
    name: string,
    description: RangeFilter,
}

export default function RangeFilter({ name, description }: Props) {
    const { label, unit, range } = description;

    const submit = useSubmit();
    const [searchParams] = useSearchParams();
    const urlValue = searchParams.getAll(name);
    const [value, setValue] = React.useState<number[]>(urlValue.length ? urlValue.map(v => +v) : getDefaultRangeValue(description));

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
            <Typography id={name+"_group"} level="body1" fontWeight="lg" mb={1} style={{ marginBottom: "2rem" }}>
            {label}
            </Typography>
            <Slider
                name={name}
                getAriaLabel={() => label}
                value={value}
                onChange={handleChange}
                valueLabelDisplay="on"
                valueLabelFormat={valueText}
                getAriaValueText={valueText}
                min={Math.min(...range)}
                max={Math.max(...range)}
            />
        </div>
    );
}
