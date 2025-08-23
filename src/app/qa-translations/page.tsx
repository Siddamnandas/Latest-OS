import { useMessages } from 'next-intl';

export default function TranslationQA() {
  const messages = useMessages();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Translation Messages</h1>
      <pre className="overflow-auto rounded bg-muted p-4 text-sm">
        {JSON.stringify(messages, null, 2)}
      </pre>
    </div>
  );
}
