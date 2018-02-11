import { Logger } from 'core/logger';

interface OnFinishHandler<T> {
  (results: T[]): void;
}

interface Task<T> {
  (cb: (res: T | Error) => void): void;
}

export class TaskLimit<T> {
  private currentNumTasks: number = 0;
  private concurrency: number = 0;
  private pendingTasks: Task<T>[] = [];
  private results: Array<T | Error> = [];
  private unfinishedCount = 0;

  constructor(concurrency: number, private logger: Logger) {
    this.currentNumTasks = 0;
    this.concurrency = concurrency;
    this.pendingTasks = [];
  }

  push(task: Task<T>) {
    ++this.unfinishedCount;
    this.pendingTasks.push(task);
    if (this.currentNumTasks < this.concurrency) {
      this.lift();
    }
  }

  onFinish(handler: OnFinishHandler<T | Error>) {
    this.onFinishHandler = handler;
  }

  private onFinishHandler: OnFinishHandler<T | Error> = (results: Array<T | Error>) => {
    return;
  }

  private lift() {
    this.currentNumTasks++;
    let task = this.pendingTasks.shift();
    if (task !== undefined) {
      task(this.doneHandler.bind(this));
    }
  }

  private doneHandler(result: Error | T) {
    --this.currentNumTasks;
    --this.unfinishedCount;
    this.results.push(result);
    if (this.unfinishedCount === 0) {
      return this.onFinishHandler(this.results);
    }
    if (typeof result === typeof Error) {
      this.logger.trace('Error occurred: ', result);
    }
    this.lift();
  }
}
