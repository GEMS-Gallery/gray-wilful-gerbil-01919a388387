import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Model {
  'id' : string,
  'name' : string,
  'description' : string,
}
export interface ModelDetails {
  'parameters' : Parameters,
  'description' : string,
}
export interface Parameters { 'temperature' : number, 'maxTokens' : bigint }
export type Result = { 'ok' : ModelDetails } |
  { 'err' : string };
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export interface _SERVICE {
  'generateText' : ActorMethod<[string, string, [] | [Parameters]], Result_1>,
  'getModelDetails' : ActorMethod<[string], Result>,
  'getModels' : ActorMethod<[], Array<Model>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
