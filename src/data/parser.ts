import type { Question, Quiz } from '../types';

interface Definition { id:string; title:string; shortTitle:string; description:string; expectedCount:number; formats:string[]; language:'en'|'fil'; raw:string; contentNote?:string }
const clean = (s:string) => s.replace(/\*\*/g,'').trim();

function explainChoices(text:string, question:Question):Record<string,string>|undefined {
  if (!question.choices) return undefined;
  const result:Record<string,string> = {};
  for (const choice of question.choices) {
    const letter = choice.id.split('-').at(-1)!;
    const match = text.match(new RegExp(`(?:^|\\s)${letter}(?:\\s+(?:is|are)|\\s*=|\\s+ay)\\s+(.+?)(?=(?:\\s+[A-D](?:\\s+(?:is|are)|\\s*=|\\s+ay))|$)`,'i'));
    if (match && choice.id !== question.correctAnswerId) result[choice.id] = match[1].trim();
  }
  return Object.keys(result).length ? result : undefined;
}

export function parseBank(def:Definition):Quiz {
  const answerHeading = def.language === 'fil' ? '## Susi sa Pagwawasto' : '## Answer Key';
  const [questionPart, answerAndAfter=''] = def.raw.split(answerHeading);
  const questionSection = questionPart.split(def.language === 'fil' ? '## Mga Tanong' : '## Questions')[1] ?? '';
  const questions:Question[] = [];
  let current:Question|null = null;
  let inTrueFalse = false;
  for (const line of questionSection.split(/\r?\n/)) {
    if (/^### (True or False|Tama o Mali)/.test(line)) { inTrueFalse = true; continue; }
    const qm = line.match(/^(\d+)\.\s+(.+)/);
    if (qm) {
      const n = Number(qm[1]);
      current = { id:`${def.id}-${n}`, quizId:def.id, originalNumber:n, type:inTrueFalse?'true-false':'multiple-choice', text:qm[2].trim(), choices:inTrueFalse ? [{id:`${def.id}-${n}-true`,text:def.language==='fil'?'Tama':'True'},{id:`${def.id}-${n}-false`,text:def.language==='fil'?'Mali':'False'}] : [], correctAnswerId:'', explanation:'', source:'', shuffleChoices:!inTrueFalse };
      questions.push(current); continue;
    }
    const cm = line.match(/^\s+-\s+([A-D])\.\s+(.+)/);
    if (cm && current?.type === 'multiple-choice') current.choices!.push({id:`${current.id}-${cm[1]}`,text:cm[2].trim()});
  }
  const answerLines = answerAndAfter.split(def.language === 'fil' ? '## Checklist ng Saklaw' : '## Coverage Checklist')[0].split(/\r?\n/);
  for (const line of answerLines) {
    const am = line.match(/^(\d+)\.\s+\*\*(A|B|C|D|True|False|Tama|Mali)\.\*\*\s*(.+)$/i);
    if (!am) continue;
    const q = questions.find(x=>x.originalNumber===Number(am[1])); if (!q) continue;
    const citation = am[3].match(/\*\(([^)]+)\)\*\s*$/);
    q.source = citation?.[1] ?? 'Question bank';
    q.explanation = clean(am[3].replace(/\s*\*\([^)]+\)\*\s*$/,''));
    const key = am[2].toLowerCase();
    q.correctAnswerId = q.type==='true-false' ? `${q.id}-${key==='true'||key==='tama'?'true':'false'}` : `${q.id}-${key.toUpperCase()}`;
    q.incorrectChoiceExplanations = explainChoices(q.explanation,q);
  }
  validateQuiz(def,questions);
  return {id:def.id,title:def.title,shortTitle:def.shortTitle,description:def.description,expectedCount:def.expectedCount,formats:def.formats,language:def.language,contentNote:def.contentNote,questions};
}

function validateQuiz(def:Definition, questions:Question[]) {
  const errors:string[]=[];
  if (questions.length!==def.expectedCount) errors.push(`expected ${def.expectedCount}, found ${questions.length}`);
  questions.forEach((q,i)=>{ if(q.originalNumber!==i+1) errors.push(`numbering gap near ${q.originalNumber}`); if(!q.correctAnswerId||!q.explanation||!q.source) errors.push(`question ${q.originalNumber} has no complete key entry`); if(q.type==='multiple-choice'&&q.choices?.length!==4) errors.push(`question ${q.originalNumber} does not have four choices`); if(!q.choices?.some(c=>c.id===q.correctAnswerId)) errors.push(`question ${q.originalNumber} answer cannot be mapped`); });
  if(new Set(questions.map(q=>q.id)).size!==questions.length) errors.push('duplicate stable IDs');
  if(errors.length) throw new Error(`${def.title} import failed:\n${errors.join('\n')}`);
}

export type { Definition };
