import Person from './Person.js'

export default class Student extends Person {
  mathScore
  physicScore
  chemistryScore
  averageScore() {
    const m = Number(this.mathScore)
    const p = Number(this.physicScore)
    const c = Number(this.chemistryScore)
    const avr = (m + p + c) / 3
    return Number.isInteger(avr) ? avr : avr.toFixed(1)
  }
}
