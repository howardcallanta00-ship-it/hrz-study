export type QuestionType = 'multiple-choice' | 'true-false' | 'identification';
export interface Choice { id:string; text:string }
export interface Question { id:string; quizId:string; originalNumber:number; type:QuestionType; text:string; choices?:Choice[]; correctAnswerId:string; explanation:string; incorrectChoiceExplanations?:Record<string,string>; source:string; image?:string; codeBlock?:string; shuffleChoices:boolean }
export interface Quiz { id:string; title:string; shortTitle:string; description:string; expectedCount:number; formats:string[]; language:'en'|'fil'; contentNote?:string; questions:Question[] }
export interface SetupOptions { shuffleQuestions:boolean; shuffleChoices:boolean; startingQuestion:number }
export interface Attempt { version:2; quizId:string; mode:'original'|'practice'; options:SetupOptions; questionOrder:string[]; choiceOrders:Record<string,string[]>; currentIndex:number; selected:Record<string,string>; checked:Record<string,boolean>; results:Record<string,boolean>; completed:boolean; originalScore?:number; originalTotal?:number; originalMistakes?:string[]; mistakePool?:string[]; practiceRounds:number }
export type ThemePreference = 'light'|'dark'|'system';
