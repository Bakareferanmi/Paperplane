export const CLASS_CODES = [
  "SS1-ART",
  "SS1-COM",
  "SS1-SCI",
  "SS2-ART",
  "SS2-COM",
  "SS2-SCI",
  "SS3-ART",
  "SS3-COM",
  "SS3-SCI",
] as const;

export type ClassCode = (typeof CLASS_CODES)[number];

export const CLASS_LABELS: Record<ClassCode, string> = {
  "SS1-ART": "SS1 Art",
  "SS1-COM": "SS1 Commercial",
  "SS1-SCI": "SS1 Science",
  "SS2-ART": "SS2 Art",
  "SS2-COM": "SS2 Commercial",
  "SS2-SCI": "SS2 Science",
  "SS3-ART": "SS3 Art",
  "SS3-COM": "SS3 Commercial",
  "SS3-SCI": "SS3 Science",
};

export function isClassCode(value: string): value is ClassCode {
  return (CLASS_CODES as readonly string[]).includes(value);
}
