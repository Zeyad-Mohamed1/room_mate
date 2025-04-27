interface PropertyDescriptionProps {
  description: string;
}

export default function PropertyDescription({
  description,
}: PropertyDescriptionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Description</h2>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}
