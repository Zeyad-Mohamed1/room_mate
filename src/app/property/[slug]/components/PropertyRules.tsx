interface PropertyRulesProps {
  rules: string[];
}

export default function PropertyRules({ rules }: PropertyRulesProps) {
  if (!rules || rules.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">House Rules</h2>
      <ul className="list-disc pl-5 space-y-1">
        {rules.map((rule, index) => (
          <li key={index} className="text-gray-700">
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}
