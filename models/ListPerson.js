import Customer from './Customer.js'
import Employee from './Employee.js'
import Student from './Student.js'

export default class ListPerson {
  static list = []
  /* Instance Of Class */
  static student = () => new Student()
  static employee = () => new Employee()
  static customer = () => new Customer()

  /* Render List Person */
  static render(DOM, listPerson = this.list) {
    let htmlString = ''
    for (const person of listPerson) {
      htmlString += `
      <tr>
        <td class="text-center">${person.id}</td>
        <td>${person.name}</td>
        <td>${person.address}</td>
        <td>${person.email}</td>
        <td class="text-center">${
          person.averageScore ? person.averageScore() : ''
        }</td>
        <td class="text-center">${
          person.totalSalary ? person.totalSalary() : ''
        }</td>
        <td class="text-center">${person.nameCompany || ''}</td>
        <td class="text-center">${
          person.billInvoice
            ? Number(person.billInvoice).toLocaleString() + ` VND`
            : ''
        }</td>
        <td class="text-center">${person.customerReview || ''}</td>
        <td class="text-center">
          <button class="btn btn-primary btn-sm btn-edit" data-bs-toggle="modal" data-bs-target="#formInput">
            <i class="fa fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm btn-delete">
            <i class="fa fa-times-circle"></i>
          </button>
        </td>
        <td class="text-center text-capitalize">${person.category || ''}</td>
      </tr>
    `
    }
    DOM.tableElement.innerHTML = htmlString
  }
  /* Assign Event Button */
  static eventHandleBtn(DOM, listPerson = this.list) {
    const btnListEdit = document.querySelectorAll(DOM.btnListEdit)
    const btnListDelete = document.querySelectorAll(DOM.btnListDelete)
    for (const [index, btn] of btnListEdit.entries()) {
      btn.addEventListener('click', () => {
        this.edit(listPerson[index].id, DOM)
      })
    }
    for (const [index, btn] of btnListDelete.entries()) {
      btn.addEventListener('click', () => {
        ListPerson.delete(listPerson[index].id)
        this.render(DOM)
        this.eventHandleBtn(DOM)
        this.empty(DOM)
        this.total(DOM)
        this.saveLocal()
      })
    }
  }
  /* Add Person */
  static add(person) {
    this.list.push(person)
  }
  /* Edit Person */
  static edit(id, DOM) {
    const person = this.list.find((element) => element.id === id)
    for (const input of DOM.inputList) {
      if (!person.hasOwnProperty(input.id)) {
        input.value = ''
      } else {
        input.value = person[input.id]
      }
    }
    DOM.categoryForm.value = person.category
    DOM.categoryForm.dispatchEvent(new Event('change'))
    DOM.categoryForm.setAttribute('disabled', true)
    DOM.inputList[0].setAttribute('disabled', true)
    DOM.btnAddPerson.setAttribute('disabled', true)
    DOM.btnUpdatePerson.removeAttribute('disabled')
    DOM.btnClose.addEventListener(
      'click',
      () => {
        this.resetForm(DOM)
      },
      { once: true }
    )
  }
  /* Delete Person */
  static delete(id) {
    const indexPerson = this.list.findIndex((element) => element.id === id)
    this.list.splice(indexPerson, 1)
  }
  /* Update Person */
  static update(personEdit) {
    debugger
    const person = this.list.find((person) => person.id === personEdit.id)
    Object.assign(person, personEdit)
  }
  /* Total Person */
  static total(DOM, listPerson = this.list) {
    const total = listPerson.length
    DOM.totalElement.innerHTML = total
  }
  /* Check Empty */
  static empty(DOM) {
    const tdTable = DOM.tableElement.querySelectorAll('td')
    for (const td of tdTable) {
      if (!td.innerHTML) {
        td.classList.add('bg-body-secondary')
      }
      if (td.innerHTML === 'student') {
        td.classList.add('text-bg-success')
      }
      if (td.innerHTML === 'employee') {
        td.classList.add('text-bg-primary')
      }
      if (td.innerHTML === 'customer') {
        td.classList.add('text-bg-danger')
      }
    }
  }
  /* Reset Form */
  static resetForm(DOM) {
    DOM.categoryForm.value = 'select'
    DOM.categoryForm.dispatchEvent(new Event('change'))
    DOM.categoryForm.removeAttribute('disabled')
    DOM.btnAddPerson.removeAttribute('disabled')
    DOM.btnUpdatePerson.setAttribute('disabled', true)
    for (const input of DOM.inputList) {
      input.value = ''
    }
  }
  /* Reset Message Error */
  static resetMessage(DOM) {
    for (const input of DOM.inputList) {
      input.classList.remove('border-danger')
    }
    for (const error of DOM.errorList) {
      error.classList.add('d-none')
    }
    if (DOM.categoryForm.classList.contains('bg-danger')) {
      DOM.categoryForm.classList.remove('bg-danger', 'text-bg-danger')
      DOM.categoryForm.querySelector('[value="error"]').remove()
    }
  }
  /* Sort By Name */
  static sort() {
    const listSortByName = [...this.list]
    listSortByName.sort((a, b) => {
      const fullNameA = a.name.toLowerCase()
      const fullNameB = b.name.toLowerCase()
      const nameA = fullNameA.split(' ')
      const nameB = fullNameB.split(' ')
      if (nameA[nameA.length - 1] < nameB[nameB.length - 1]) return -1
      if (nameA[nameA.length - 1] > nameB[nameB.length - 1]) return 1
      return 0
    })
    return listSortByName
  }
  /* Save List Person To Local */
  static saveLocal() {
    if (this.list.length) {
      localStorage.setItem('listPerson', JSON.stringify(this.list))
      return
    }
    localStorage.removeItem('listPerson')
  }
  /* Get List Person From Local And Render */
  static getLocal(DOM) {
    /* Get List, Return If Get False */
    let listPersonLocal
    if (localStorage.getItem('listPerson')) {
      listPersonLocal = JSON.parse(localStorage.getItem('listPerson'))
    } else return
    /* Convert List Because Local Not Save Function */
    this.list = listPersonLocal.map((element) => {
      const person = this[element.category]()
      Object.assign(person, element)
      return person
    })
    /* Render List Person */
    this.render(DOM)
    this.eventHandleBtn(DOM)
    this.empty(DOM)
    this.total(DOM)
  }
}
