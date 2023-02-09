declare module 'lite-ts-value/custom-error' {
  export class CustomError extends Error {
      code: number;
      data?: any;
      constructor(code: number, data?: any);
  }

}
declare module 'lite-ts-value/delegate-value-service' {
  import { INowTime } from 'lite-ts-value/i-now-time';
  import { IValue } from 'lite-ts-value/i-value';
  import { ValueServiceBase } from 'lite-ts-value/value-service-base';
  export class DelegateValueService extends ValueServiceBase {
      private m_GetCountFunc;
      private m_UpdateAction;
      constructor(m_GetCountFunc: (valueType: number) => Promise<number>, m_UpdateAction: (value: IValue) => Promise<void>, nowTime: INowTime, notEnoughtErrorCode: number);
      getCount(valueType: number): Promise<number>;
      update(values: IValue[]): Promise<void>;
  }

}
declare module 'lite-ts-value/i-now-time' {
  export interface INowTime {
      unix(): Promise<number>;
  }

}
declare module 'lite-ts-value/i-value-condition' {
  import { IValue } from 'lite-ts-value/i-value';
  export interface IValueCondition extends IValue {
      op: string;
  }

}
declare module 'lite-ts-value/i-value' {
  export interface IValue {
      count: number;
      valueType: number;
  }

}
declare module 'lite-ts-value/index' {
  export * from 'lite-ts-value/delegate-value-service';
  export * from 'lite-ts-value/value-service-base';

}
declare module 'lite-ts-value/relation-operator' {
  export enum RelationOperator {
      eq = "=",
      ge = ">=",
      gt = ">",
      le = "<=",
      lt = "<",
      nowDiff = "now-diff",
      mod = "%"
  }

}
declare module 'lite-ts-value/value-service-base' {
  import { INowTime } from 'lite-ts-value/i-now-time';
  import { IValue } from 'lite-ts-value/i-value';
  import { IValueCondition } from 'lite-ts-value/i-value-condition';
  export abstract class ValueServiceBase {
      protected nowTime: INowTime;
      protected notEnoughtErrorCode: number;
      constructor(nowTime: INowTime, notEnoughtErrorCode: number);
      checkConditions(conditions: IValueCondition[][]): Promise<boolean>;
      checkEnough(times: number, values: IValue[]): Promise<void>;
      mustCheckEnough(times: number, values: IValue[]): Promise<boolean>;
      abstract getCount(valueType: number): Promise<number>;
      abstract update(values: IValue[]): Promise<void>;
  }

}
declare module 'lite-ts-value/value-service-base_test' {
  export {};

}
declare module 'lite-ts-value' {
  import main = require('lite-ts-value/index');
  export = main;
}