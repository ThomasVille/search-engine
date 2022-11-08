import { BikeFilters, BikeFilterType } from '~/models/bikes';
import { Form } from '@remix-run/react';
import RangeFilter from './RangeFilter';
import EnumFilter from './EnumFilter';
import BooleanFilter from './BooleanFilter';
import React from 'react';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from '@mui/joy/IconButton';

import { Button, Typography } from '@mui/joy';
import { useMediaQuery } from '@mui/material';
export interface SortMenuProps {
    sortField: string
}

export default function FilterMenu({sortField}: SortMenuProps) {
    const [open, setOpen] = React.useState(false);

    const handleClick = (event: any) => {
        setOpen(!open);
    };

    const isDesktop = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));

    return (
        <div>
            {
                (!isDesktop && !open) ? (
                    <Button
                        id="filter-menu-button"
                        aria-controls={open ? 'filter-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        variant="soft"
                        color="neutral"
                        onClick={handleClick}
                        startDecorator={<FilterAltOutlinedIcon />}
                        className="w-40"
                    >
                        Filtrer
                    </Button>
                ) : null
            }
            <div className={`z-10 fixed lg:relative bottom-0 left-0 w-full overflow-y-auto lg:w-80 h-full py-14 lg:p-0 ${(open || isDesktop) ? "block" : "hidden"} border-r bg-gray-50 flex flex-col items-stretch`}>
                <div className="flex justify-between items-center pl-2 bg-gray-100 lg:bg-inherit">
                    <Typography id="filter_header" level="h5" fontWeight="lg">
                        Filtrer
                    </Typography>
                    {
                        !isDesktop ? (
                            <IconButton variant="plain" onClick={handleClick} className="lg:hidden">
                                <CloseOutlinedIcon />
                            </IconButton>
                        ) : null
                    }
                </div>
                <div className="flex-1 p-6">
                    <Form method="get">
                        {
                            Object.entries(BikeFilters).map(([key, value]) => {
                                switch (value.type) {
                                    case BikeFilterType.RANGE:
                                        return <RangeFilter
                                            key={key}
                                            name={key}
                                            description={value}
                                        />;
                                    case BikeFilterType.ENUM:
                                        return <EnumFilter
                                            key={key}
                                            name={key}
                                            description={value}
                                        />;
                                    case BikeFilterType.BOOLEAN:
                                        return <BooleanFilter
                                            key={key}
                                            name={key}
                                            description={value}
                                        />;
                                }
                            })
                        }
                        <input
                            type="hidden"
                            name="sort"
                            value={sortField}
                        />
                    </Form>
                </div>
                {
                    !isDesktop ? (
                        <div className="lg:hidden mx-auto">
                            <Button variant="solid" onClick={handleClick} className="w-40">
                                Valider
                            </Button>
                        </div>
                    ) : null
                }
            </div>
        </div>
    );
}
