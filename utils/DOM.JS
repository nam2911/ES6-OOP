/* DOM Element */
export const DOM = {
  btnAddPerson: document.querySelector('#addPerson'),
  btnUpdatePerson: document.querySelector('#updatePerson'),
  btnResetForm: document.querySelector('#resetForm'),
  btnClose: document.querySelector('#btn-close'),
  btnSort: document.querySelector('#sort-by-name'),
  inputList: Array.from(document.querySelectorAll('.modal-body input')),
  categoryForm: document.querySelector('#category'),
  tableElement: document.querySelector('tbody'),
  searchBox: document.querySelector('#searchBox'),
  filterCategory: document.querySelector('#filterCategory'),
  errorList: document.querySelectorAll('.form-message'),
  totalElement: document.querySelector('#totalPerson'),
  formInput: document.querySelector('.form-input'),
  btnListEdit: '.btn-edit',
  btnListDelete: '.btn-delete',
}
