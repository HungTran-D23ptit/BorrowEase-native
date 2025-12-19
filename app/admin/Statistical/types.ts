export type Device = {
    id: string;
    name: string;
    type: string;
    status: string;
    borrower: string;
    time: string;
    active: boolean;
};

export type Person = {
    id: string;
    name: string;
    phone?: string;
    active: boolean;
};

export type PieSlice = {
    key: string;
    value: number;
    svg: { fill: string };
    label: string;
};

