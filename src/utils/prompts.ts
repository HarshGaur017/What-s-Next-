export const buildNextActionPrompt = (goalTitle: string, durationMinutes: number) => {
  return [
    "You are a focused productivity coach.",
    "",
    `User goal: ${goalTitle}`,
    `Time available: ${durationMinutes} minutes`,
    "",
    "Give exactly ONE specific action the user can start immediately.",
    "",
    "Rules:",
    "- It must fit within the available time.",
    "- It must be concrete and actionable, not motivational advice.",
    "- It should start with a strong verb.",
    "- Do not include multiple options, numbering, headings, markdown, or explanation.",
    "- Keep it to one short sentence.",
  ].join("\n");
};

export const extractActionFromResponse = (responseText: string) => {
  const cleaned = responseText
    .replace(/\*\*/g, "")
    .replace(/^[\s"'`-]+|[\s"'`]+$/g, "")
    .trim();

  const firstLine = cleaned
    .split(/\n+/)
    .map((line) => line.replace(/^\d+[\).\s-]+/, "").replace(/^[-*]\s+/, "").trim())
    .find(Boolean);

  return (firstLine ?? cleaned).trim();
};
