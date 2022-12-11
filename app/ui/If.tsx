import React from "react";

interface IfProps {
    children: React.ReactChild[],
    when: boolean,
}

export function If({ children, when }: IfProps) {
    if (children.length < 2) {
        throw new Error('"If" Component requires two children');
    }

    if (when) {
        return <React.Fragment>{children[0]}</React.Fragment>;
    } else {
        return <React.Fragment>{children[1]}</React.Fragment>;
    }
}

interface ThenProps {
    children: React.ReactChild,
}

export function Then({ children }: ThenProps) {
    return <React.Fragment>{children}</React.Fragment>;
}

interface ElseProps {
    children: React.ReactChild,
}

export function Else({ children }: ElseProps) {
    return <React.Fragment>{children}</React.Fragment>;
}