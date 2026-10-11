import { describe,expect,it } from 'vitest';
import { quizzes } from '../data/quizzes';
import { canFinish, checkAnswer, createAttempt, finishOriginal, finishPractice, shuffle } from './quiz';
const quiz=quizzes[0];const opts={shuffleQuestions:true,shuffleChoices:true,startingQuestion:1};
describe('quiz logic',()=>{
 it('imports the expected 43, 41, 38, and 69 questions',()=>expect(quizzes.map(q=>q.questions.length)).toEqual([43,41,38,69]));
 it('shuffling preserves every question exactly once',()=>{const a=createAttempt(quiz,opts);expect(new Set(a.questionOrder)).toEqual(new Set(quiz.questions.map(q=>q.id)));expect(a.questionOrder).toHaveLength(quiz.questions.length)});
 it('choice shuffling preserves correct answer mapping',()=>{const a=createAttempt(quiz,opts);quiz.questions.forEach(q=>expect(a.choiceOrders[q.id]).toContain(q.correctAnswerId))});
 it('disabled choice shuffling retains order',()=>{const q={...quiz.questions[0],shuffleChoices:false};const custom={...quiz,questions:[q]};const a=createAttempt(custom,opts);expect(a.choiceOrders[q.id]).toEqual(q.choices?.map(c=>c.id))});
 it('checked answers remain locked',()=>{const a=createAttempt(quiz,opts);const q=quiz.questions[0];a.selected[q.id]=q.correctAnswerId;const checked=checkAnswer(a,q);checked.selected[q.id]='changed';expect(checkAnswer(checked,q).results[q.id]).toBe(true)});
 it('completion is blocked while unchecked questions remain',()=>expect(canFinish(createAttempt(quiz,opts))).toBe(false));
 it('mistake pool includes only misses and original score is retained',()=>{let a=createAttempt({...quiz,questions:quiz.questions.slice(0,2)},opts);a.checked={ [a.questionOrder[0]]:true,[a.questionOrder[1]]:true};a.results={ [a.questionOrder[0]]:true,[a.questionOrder[1]]:false};a=finishOriginal(a);expect(a.mistakePool).toEqual([a.questionOrder[1]]);expect(a.originalScore).toBe(1);const p={...a,mode:'practice' as const,questionOrder:[a.questionOrder[1]],checked:{[a.questionOrder[1]]:true},results:{[a.questionOrder[1]]:true},completed:false};expect(finishPractice(p).mistakePool).toEqual([]);expect(finishPractice(p).originalScore).toBe(1)});
 it('repeated misses remain in mistake pool',()=>{const id=quiz.questions[0].id;const a={...createAttempt(quiz,opts,[id]),mistakePool:[id],checked:{[id]:true},results:{[id]:false}};expect(finishPractice(a).mistakePool).toEqual([id])});
 it('shuffle accepts deterministic randomness',()=>expect(shuffle([1,2,3],()=>0)).toEqual([2,3,1]));
});
