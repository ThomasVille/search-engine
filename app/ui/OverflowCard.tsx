import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';

interface Props {
    img: string,
    link: string,
    title: string,
    subtitle: string,
    left_footer: string,
    right_footer: string,
}

export default function OverflowCard({ img, link, title, subtitle, left_footer, right_footer }: Props) {
    return (
        <Card variant="outlined" sx={{ width: 286 }}>
            <CardOverflow>
                <AspectRatio ratio="1.2">
                    <img
                        src={img}
                        loading="lazy"
                        alt={`Illustration du vélo ${title}`}
                    />
                </AspectRatio>
            </CardOverflow>
            {/*
        The height depends on the fontSize and the number of lines of text shown.
        See https://css-tricks.com/line-clampin/ for methods for clamping text to a number of lines.
        */}
            <Typography level="h2" sx={{ fontSize: 'md', mt: 2, display: "-webkit-box", WebkitLineClamp: "2", overflow: "hidden", WebkitBoxOrient: "vertical", height: "2.4em" }}>
                {title}
            </Typography>
            <Typography level="body2" sx={{ mt: 0.5, mb: 2 }}>
                <Link
                    overlay
                    underline="none"
                    href={link}
                    sx={{ color: 'text.tertiary' }}
                >
                    {subtitle}
                </Link>
            </Typography>
            <Divider />
            <CardOverflow
                variant="soft"
                sx={{
                    display: 'flex',
                    gap: 1.2,
                    py: 1.5,
                    px: 'var(--Card-padding)',
                    bgcolor: 'background.level1',
                    alignItems: "center",
                }}
            >
                <Typography level="body2" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
                    {left_footer}
                </Typography>
                <Divider orientation="vertical" />
                <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
                    {right_footer}
                </Typography>
            </CardOverflow>
        </Card>
    );
}
