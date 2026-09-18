export const CLASS_CODES = ["SS1", "SS2", "SS3"] as const;

export type ClassCode = (typeof CLASS_CODES)[number];

export const CLASS_LABELS: Record<ClassCode, string> = {
  SS1: "Senior Secondary 1",
  SS2: "Senior Secondary 2",
  SS3: "Senior Secondary 3",
};

export function isClassCode(value: string): value is ClassCode {
  return (CLASS_CODES as readonly string[]).includes(value);
}
