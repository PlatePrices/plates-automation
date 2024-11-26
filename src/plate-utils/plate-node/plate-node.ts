import { RequestyBody, Body } from './types';

export default class plateNode {
  body: Body;
  constructor({ body }: RequestyBody) {
    this.body = body;
  }
  public addPlates(plates: unknown[]): void {
    throw new Error('Method not implemented');
  }

  public addInvalidPlates(plates: unknown[]): void {
    throw new Error('Method not implemented');
  }

  public getPlates(
    source: string,
    startPage: number,
    endPage: number,
  ): unknown[] {
    throw new Error('Method not implemented');
  }

  public validatePlates(plates: unknown[]): {
    validPlates: unknown[];
    invalidPlates: unknown[];
  } {
    throw new Error('Method not implemented');
  }

  public parsePlates(): unknown[] {
    throw new Error('Method not implemented');
  }

  public savePagePerformance(
    startPage: number,
    endPage: number,
    totalTimeTaken: number,
  ) {
    throw new Error('Method not implemented');
  }
  public saveSourcePerformance(source: string, totalTimeTaken: number) {
    throw new Error('Method not implemented');
  }

  private arePlatesCached(source: string, plates: unknown[]): boolean {
    throw new Error('Method not implemented');
  }

  protected setPlatesToCache(source: string, plates: unknown[]) {
    throw new Error('Method not implemented');
  }

  protected getPlatesFromCache(source: string) {
    throw new Error('Method not implemented');
  }
}
