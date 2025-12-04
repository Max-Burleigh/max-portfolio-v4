import React from "react";

export interface TechItem {
    icon: React.ReactNode;
    label: string;
}

export interface TechStackProps {
    items: TechItem[];
    className?: string;
    style?: React.CSSProperties;
}

const TechStack: React.FC<TechStackProps> = ({
    items,
    className = "",
    style = {},
}) => (
    <div
        className={`tech-stack flex flex-wrap gap-4 items-center justify-center md:justify-start mt-4 mb-0 ${className}`}
        style={style}
    >
        {items.map((item, index) => (
            <span
                className="tech-item flex items-center gap-2 text-[0.85rem] md:text-base md:text-[1.08rem] text-[#ededed] bg-black/10 rounded-lg py-[0.25em] pr-[0.6em] pl-[0.4em] md:py-[0.45em] md:pr-[1.1em] md:pl-[0.7em] mb-[0.15em] md:mb-1 font-medium shadow-sm transition-colors hover:bg-[rgba(0,255,213,0.1)]"
                key={index}
            >
                <span className="tech-icon text-[1.2em] md:text-[1.8em] mr-[0.35em] md:mr-2 align-middle drop-shadow-sm">
                    {item.icon}
                </span>
                {item.label}
            </span>
        ))}
    </div>
);

export default TechStack;

