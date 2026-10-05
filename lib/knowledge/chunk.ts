export type TextChunk = {
  index: number;
  content: string;
  charCount: number;
};

const TARGET = 3600;
const OVERLAP = 350;

export function chunkText(input: string): TextChunk[] {
  const text = input.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!text) return [];

  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";

  const pushCurrent = () => {
    const value = current.trim();
    if (value) chunks.push(value);
    current = "";
  };

  for (const paragraph of paragraphs) {
    if (paragraph.length > TARGET) {
      pushCurrent();
      let start = 0;
      while (start < paragraph.length) {
        const end = Math.min(start + TARGET, paragraph.length);
        chunks.push(paragraph.slice(start, end).trim());
        if (end === paragraph.length) break;
        start = Math.max(end - OVERLAP, start + 1);
      }
      continue;
    }

    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (candidate.length <= TARGET) {
      current = candidate;
    } else {
      const previous = current;
      pushCurrent();
      const overlap = previous.slice(Math.max(0, previous.length - OVERLAP));
      current = overlap ? `${overlap}\n\n${paragraph}` : paragraph;
    }
  }

  pushCurrent();

  return chunks.map((content, index) => ({
    index,
    content,
    charCount: content.length,
  }));
}
