import FieldClassProps from "../interfaces/Field.interface";

export default class Field implements FieldClassProps {
  private field: string;

  constructor () {
    this.field = " ".repeat(9);
  }

  getField (): string {
    return this.field;
  }

  setField (field: string) {
    this.field = field;
  }
}
