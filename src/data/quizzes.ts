import communication from './banks/effective-communication.md?raw';
import mathematics from './banks/general-mathematics.md?raw';
import pklp from './banks/pklp.md?raw';
import science from './banks/general-science.md?raw';
import { parseBank, type Definition } from './parser';

const definitions:Definition[]=[
 {id:'effective-communication',title:'Effective Communication',shortTitle:'Communication',description:'Interviews, group discussion, multimodal essays, and position papers.',expectedCount:43,formats:['Multiple choice','True or false'],language:'en',raw:communication},
 {id:'general-mathematics',title:'General Mathematics',shortTitle:'Mathematics',description:'Piecewise functions, data and measurement, and trigonometric ratios.',expectedCount:41,formats:['Multiple choice','True or false'],language:'en',raw:mathematics},
 {id:'pklp',title:'PKLP',shortTitle:'PKLP',description:'Pakikibaka, mga patakarang kolonyal, mga pag-aalsa, at mga reporma.',expectedCount:38,formats:['Multiple choice','Tama o mali'],language:'fil',raw:pklp,contentNote:'Source note: The bank retains its ambiguity note about Luis Taruc and does not invent a correction.'},
 {id:'general-science',title:'General Science',shortTitle:'Science',description:'Chemical reactions, mixtures, solutions, laboratory tools, safety, and hazards.',expectedCount:69,formats:['Multiple choice','True or false'],language:'en',raw:science,contentNote:'The source warns that percentage formulas are absent; this note is metadata, not a quiz item.'}
];
export const quizzes=definitions.map(parseBank);
export const allQuestions=quizzes.flatMap(q=>q.questions);
