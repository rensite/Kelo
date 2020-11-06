export default class Task {
  constructor(title = '', id = 0, state = false) {
    this.id = id;
    this.title = title;
    this.state = state;
  }
}
