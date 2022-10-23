import React, { useCallback } from 'react';
import { useSubmit, useSearchParams } from "@remix-run/react";
import { debounce } from 'lodash';

import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import ListItem from '@mui/joy/ListItem';
import Checkbox from '@mui/joy/Checkbox';
import List from '@mui/joy/List';
import { BooleanFilter, getDefaultBooleanValue } from '~/models/bikes';

interface Props {
    name: string,
    description: BooleanFilter,
}

export default function EnumFilter({ name, description }: Props) {
    const { label } = description;
    const options = [
        {
          label: "Oui",
          value: "true",
        },
        {
          label: "Non",
          value: "false",
        },
    ];
    const submit = useSubmit();
    const [searchParams] = useSearchParams();
    const urlValue = searchParams.getAll(name);
    const [value, setValue] = React.useState(urlValue.length ? urlValue : getDefaultBooleanValue());

    const debouncedSubmit = useCallback(
        debounce((target: any, options: any) => submit(target, options), 250),
        [],
    );

    const handleChange = (checkedValue: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event?.target?.checked) {
          setValue([...new Set(value.concat(checkedValue))]);
        } else {
          setValue(value.filter(v => v !== checkedValue));
        }
        debouncedSubmit(document.forms[0], { replace: true });
    }

    return (
        <div>
            <Typography id={name+"_group"} level="body1" fontWeight="lg" mb={1}>
                {label}
            </Typography>
            <Box role="group" aria-labelledby={name+"_group"}>
                <List size="sm">
                    {
                        options.map(o => (
                            <ListItem key={o.value}>
                                <Checkbox name={name} value={o.value} label={o.label} checked={value.includes(o.value)} onChange={handleChange(o.value)} />
                            </ListItem>
                        ))
                    }
                </List>
            </Box>
        </div>
    );
}
