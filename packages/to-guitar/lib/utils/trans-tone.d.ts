import type { Tone, Note, ToneSchema, Pitch } from '../interface';
declare function transNote(x: Tone): Note;
declare function transNote(x: Tone[]): Note[];
declare function transTone(note: Note): ToneSchema;
declare function transTone(note: number): ToneSchema;
declare function transToneNum(x: Tone): Pitch;
declare function transToneNum(x: Tone[]): Pitch[];
export { transTone, transNote, transToneNum };
