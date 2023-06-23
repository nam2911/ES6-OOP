import Person from './Person.js'

export default class Employee extends Person {
  daysWorking
  dailySalary
  totalSalary() {
    return `${(this.daysWorking * this.dailySalary).toLocaleString()} VND`
  }
}
