import React from "react";

interface MapProps<T> {
    children: (arg: T) => React.ReactChild,
    array: T[],
}

export function Map<T>({ children, array }: MapProps<T>) {
    return <React.Fragment>
        {
            array.map(children)
        }
    </React.Fragment>;
}