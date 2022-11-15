import React from 'react';
import Button from '@mui/joy/Button';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import { BikeFilters, canSort, getSortDetails } from '~/models/bikes';
import { ListItemDecorator } from '@mui/joy';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';

export interface SortMenuProps {
    selected: string
    setSelected: Function
}

export default function SortMenu({selected, setSelected}: SortMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (fieldName: string | null) => () => {
        setAnchorEl(null);
        if (fieldName) setSelected(fieldName);
    };

    const { field: sortField, ascending } = getSortDetails(selected);

    return (
        <div>
            <Button
                id="sort-menu-button"
                aria-controls={open ? 'sort-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="soft"
                color="neutral"
                onClick={handleClick}
                startDecorator={ascending ? <NorthIcon /> : <SouthIcon />}
                className="w-40"
            >
                {BikeFilters[sortField].label}
            </Button>
            <Menu
                id="sort-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose(null)}
                aria-labelledby="sort-menu-button"
                className="w-full lg:w-auto"
            >
                {
                    Object.entries(BikeFilters).filter(([key, value]) => canSort(value)).sort((a, b) => a[1].label.localeCompare(b[1].label)).flatMap(([key, value]) => ([
                        <MenuItem key={key} selected={sortField === key && ascending} onClick={handleClose(key + '.asc')}>
                            <ListItemDecorator>
                                <NorthIcon />
                            </ListItemDecorator>
                            {value.label}
                        </MenuItem>,
                        <MenuItem selected={sortField === key && !ascending} onClick={handleClose(key + '.desc')}>
                            <ListItemDecorator>
                                <SouthIcon />
                            </ListItemDecorator>
                            {value.label}
                        </MenuItem>
                    ]))
                }
            </Menu>
        </div>
    );
}
