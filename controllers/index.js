import {DOM} from '../utils/DOM.JS'
import ListPerson from '../models/ListPerson.js'
import Validation from '../models/Validation.js'

/* Validation Add */
DOM.btnAddPerson.onclick = (event) => {
  Validation.validateForm(DOM, event)
}
/* If Valid True, Add Person To List */
Validation.addPerson = () => {
  /* New Person = Category Select */
  const person = ListPerson[DOM.categoryForm.value]()
  // /* Assign Value For Person */
  for (const property in person) {
    const input = DOM.inputList.find((element) => element.id === property)
    if (input) person[property] = input.value
  }
  person.category = DOM.categoryForm.value
  /* Render List Person */
  ListPerson.add(person)
  ListPerson.render(DOM)
  ListPerson.eventHandleBtn(DOM)
  ListPerson.empty(DOM)
  ListPerson.total(DOM)
  ListPerson.saveLocal()
  ListPerson.resetForm(DOM)
  DOM.btnClose.click()
}

/* Validation Update */
DOM.btnUpdatePerson.onclick = (event) => {
  Validation.validateForm(DOM, event)
}
/* If Valid True, Update Person At List */
Validation.updatePerson = () => {
  const personEdit = ListPerson[DOM.categoryForm.value]()
  for (const property in personEdit) {
    const input = DOM.inputList.find((element) => element.id === property)
    if (input) personEdit[property] = input.value
  }
  personEdit.category = DOM.categoryForm.value
  ListPerson.update(personEdit)
  ListPerson.render(DOM)
  ListPerson.eventHandleBtn(DOM)
  ListPerson.empty(DOM)
  ListPerson.total(DOM)
  ListPerson.saveLocal()
  ListPerson.resetForm(DOM)
  DOM.btnClose.click()
}

/* Button Sort List */
DOM.btnSort.onclick = () => {
  const listSortByName = ListPerson.sort()
  ListPerson.render(DOM, listSortByName)
  ListPerson.eventHandleBtn(DOM, listSortByName)
  ListPerson.empty(DOM)
  ListPerson.total(DOM)
}

/* Search Box */
DOM.searchBox.oninput = () => {
  const listSearch = []
  const keywordAscent = Validation.validFunctions.stringToSlug(searchBox.value)
  for (const person of ListPerson.list) {
    if (
      Validation.validFunctions
        .stringToSlug(person.name)
        .search(keywordAscent) !== -1
    ) {
      listSearch.push(person)
    }
  }
  ListPerson.render(DOM, listSearch)
  ListPerson.eventHandleBtn(DOM, listSearch)
  ListPerson.empty(DOM)
  ListPerson.total(DOM, listSearch)
}

/* Filter Category */
DOM.filterCategory.onchange = () => {
  const value = DOM.filterCategory.value // Student
  if (value === 'all') {
    ListPerson.render(DOM)
    ListPerson.eventHandleBtn(DOM)
    ListPerson.empty(DOM)
    ListPerson.total(DOM)
    return
  }
  const filterList = ListPerson.list.filter(
    (element) => element.category === value
  )
  ListPerson.render(DOM, filterList)
  ListPerson.eventHandleBtn(DOM, filterList)
  ListPerson.empty(DOM)
  ListPerson.total(DOM, filterList)
}

/* Disable Input By Category Form */
DOM.categoryForm.onchange = () => {
  if (DOM.categoryForm.value === 'error') return
  if (DOM.categoryForm.value === 'select') {
    for (const input of DOM.inputList) {
      input.removeAttribute('disabled')
    }
    ListPerson.resetMessage(DOM)
    return
  }
  for (const input of DOM.inputList) {
    if (!ListPerson[DOM.categoryForm.value]().hasOwnProperty(input.id)) {
      input.setAttribute('disabled', true)
    } else {
      input.removeAttribute('disabled')
    }
  }
  ListPerson.resetMessage(DOM)
}

/* Reset Form */
DOM.btnResetForm.onclick = () => {
  ListPerson.resetForm(DOM)
}

/* Get List Person Form Local And Render UI */
ListPerson.getLocal(DOM)
