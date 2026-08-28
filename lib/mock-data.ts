import { Customer } from "./types";

const FIRST_NAMES = [
    "Alice", "Bob", "Charlie", "Diana", "Eleanor", "Frank", "Grace", "Henry",
    "Isla", "Jack", "Karen", "Liam", "Maya", "Noah", "Olivia", "Paul",
    "Quinn", "Rosa", "Sam", "Tara", "Umar", "Vera", "Will", "Xena", "Yusuf", "Zoe",
];
const LAST_NAMES = [
    "Green", "Ross", "Davis", "Baves", "Henderson", "Chen", "Patel", "Kim",
    "Novak", "Silva", "Okafor", "Mercer", "Alvarez", "Nash", "Torres", "Iyer",
];
const COMPANIES = [
    "Acme Corp", "Globex", "Stark Industries", "Innovate Solutions Inc.",
    "Initech", "Umbrella Co", "Hooli", "Wayne Enterprises", "Wonka Industries",
];
const NOTE_SNIPPETS = [
    "Met at industry conference. Discussed upcoming renewal.",
    "Sent proposal, awaiting feedback from procurement.",
    "Very engaged, follow-up meeting scheduled.",
    "Requested pricing for enterprise tier.",
    "No response after two follow-ups.",
    "Referred by an existing customer.",
    "",
];

function seededRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
}

function pick<T>(arr: T[], rnd: () => number): T {
    return arr[Math.floor(rnd() * arr.length)];
}

function randomDate(rnd: () => number, startYear = 2023, endYear = 2024): string {
    const start = new Date(startYear, 0, 1).getTime();
    const end = new Date(endYear, 11, 31).getTime();
    return new Date(start + rnd() * (end - start)).toISOString();
}

export function generateCustomers(count = 150): Customer[] {
    const rnd = seededRandom(42);
    const customers: Customer[] = [];
    for (let i = 0; i < count; i++) {
        const first = pick(FIRST_NAMES, rnd);
        const last = pick(LAST_NAMES, rnd);
        const name = `${first} ${last}`;
        const company = pick(COMPANIES, rnd);
        const domain = company.split(" ")[0].toLowerCase().replace(/[^a-z]/g, "");
        const createdAt = randomDate(rnd, 2022, 2023);
        const lastContactDate = randomDate(rnd, 2023, 2024);
        customers.push({
            id: `cust_${i + 1}`,
            name,
            email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@${domain}.com`,
            phone: `${6 + Math.floor(rnd() * 4)}${Math.floor(rnd() * 1000000000).toString().padStart(9, "0")}`,
            company,
            status: rnd() > 0.32 ? "active" : "inactive",
            lastContactDate,
            notes: pick(NOTE_SNIPPETS, rnd),
            createdAt,
        });
    }
    return customers;
}

export const COMPANY_OPTIONS = COMPANIES;
