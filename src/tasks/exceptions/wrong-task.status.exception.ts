export class WrontTaskStatusException extends Error {
  constructor() {
    super('Wrong task status transition');

    this.name = 'WrontTaskStatusException';
  }
}
