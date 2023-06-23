export default class Validation {
  static validateForm(DOM, event) {
    /* Get Form Need Valid */
    const formElement = DOM.formInput
    const categoryForm = DOM.categoryForm
    const formRules = {}
    let isValid = true
    /* Valid Event Handle */
    const handleError = (event) => {
      let errorMessage = ''
      const errorElement =
        event.target.parentElement.querySelector('.form-message')
      formRules[event.target.id].find((valid) => {
        errorMessage = valid(event.target.value)
        return errorMessage
      })
      if (errorMessage) {
        errorElement.innerHTML = errorMessage
        errorElement.classList.remove('d-none')
        event.target.classList.add('border-danger')
        return true
      }
      return false
    }
    /* Clear Valid Event Handle */
    const clearError = (event) => {
      const errorElement =
        event.target.parentElement.querySelector('.form-message')
      errorElement.innerHTML = ''
      errorElement.classList.add('d-none')
      event.target.classList.remove('border-danger')
    }
    /* Valid Select Category */
    if (categoryForm.value === 'select') {
      categoryForm.innerHTML += `<option value="error">Please Select Category</option>`
      categoryForm.value = 'error'
      categoryForm.dispatchEvent(new Event('change'))
      categoryForm.classList.add('bg-danger', 'text-bg-danger')
      isValid = false
    }
    if (categoryForm.value === 'error') {
      isValid = false
    }
    /* Loop List Input Get Rule Check */
    if (formElement) {
      const inputList = formElement.querySelectorAll(
        '[id][rulesCheck]:not([disabled])'
      )
      for (let input of inputList) {
        let rules = input.getAttribute('rulesCheck')
        if (rules.includes('|')) {
          rules = rules.split('|')
        } else {
          rules = [rules]
        }
        for (let rule of rules) {
          if (rule.includes(':')) {
            const ruleSplit = rule.split(':')
            if (Array.isArray(formRules[input.id])) {
              formRules[input.id].push(
                this.validFunctions[ruleSplit[0]](ruleSplit[1])
              )
              continue
            }
            formRules[input.id] = [
              this.validFunctions[ruleSplit[0]](ruleSplit[1]),
            ]
            continue
          }
          if (Array.isArray(formRules[input.id])) {
            formRules[input.id].push(this.validFunctions[rule])
          } else {
            formRules[input.id] = [this.validFunctions[rule]]
          }
        }
        input.oninput = clearError
      }
      /* Valid Form */
      if (event.target.id === 'updatePerson') {
        formRules.email.splice(formRules.email.length - 1)
      }
      for (const input of inputList) {
        if (handleError({ target: input })) {
          isValid = false
        }
      }
      /* Valid True, Call Add Person */
      if (isValid && !DOM.btnAddPerson.hasAttribute('disabled')) {
        this.addPerson()
        return
      }
      /* Valid True, Call Update Person */
      if (isValid && !DOM.btnUpdatePerson.hasAttribute('disabled')) {
        this.updatePerson()
        return
      }
    }
  }
  /* Function Valid */
  static validFunctions = {
    required: (value) => {
      return value.trim() ? '' : `Please enter something`
    },
    number: (value) => {
      const regexNumber = /^[0-9]+$/
      return regexNumber.test(value) ? '' : `Input value must be number`
    },
    letter: (value) => {
      const regexLetter = /^[A-Z a-z]+$/
      return regexLetter.test(this.validFunctions.removeAscent(value))
        ? ''
        : `Input value must be letter`
    },
    email: (value) => {
      const regexEmail =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      return regexEmail.test(value) ? '' : `Invalid Email`
    },
    password: (value) => {
      const regexPassword =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      return regexPassword.test(value)
        ? ''
        : `Password needs at least one uppercase, number and special character`
    },
    minLength: (min) => {
      return (value) => {
        return value.length >= min ? '' : `Min ${min} characters`
      }
    },
    maxLength: (max) => {
      return (value) => {
        return value.length <= max ? '' : `Max ${max} characters`
      }
    },
    minValue: (min) => {
      return (value) => {
        return value >= Number(min)
          ? ''
          : `The input value must be greater than or equal to ${Number(
              min
            ).toLocaleString()}`
      }
    },
    maxValue: (max) => {
      return (value) => {
        return value <= Number(max)
          ? ''
          : `The input value must be less than or equal to ${Number(
              max
            ).toLocaleString()}`
      }
    },
    confirm: (selectorConfirm) => {
      return (value) => {
        const confirmElement = document.querySelector(selectorConfirm)
        const valueConfirm = confirmElement.value
        return value === valueConfirm
          ? ''
          : `Confirmation ${confirmElement.id} is not correcct`
      }
    },
    availableID: (listPerson) => {
      return (value) => {
        if (!localStorage.getItem(listPerson)) return ''
        const listLocal = JSON.parse(localStorage.getItem(listPerson))
        return !listLocal.find((element) => element.id === value)
          ? ''
          : `This ID: ${value} is already on the list `
      }
    },
    availableEmail: (listPerson) => {
      return (value) => {
        if (!localStorage.getItem(listPerson)) return ''
        const listLocal = JSON.parse(localStorage.getItem(listPerson))
        return !listLocal.find((element) => element.email === value)
          ? ''
          : `This Email: ${value} is already on the list `
      }
    },
    removeAscent: (string) => {
      if (string === null || string === undefined) return string
      string = string.toLowerCase()
      string = string.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      string = string.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      string = string.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      string = string.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      string = string.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      string = string.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      string = string.replace(/đ/g, 'd')
      return string
    },
    stringToSlug: (string) => {
      let slug = string.toLowerCase()
      slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
      slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
      slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
      slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
      slug = slug.replace(/đ/gi, 'd')
      slug = slug.replace(
        /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
        ''
      )
      slug = slug.replace(/ /gi, '-')
      slug = slug.replace(/\-\-\-\-\-/gi, '-')
      slug = slug.replace(/\-\-\-\-/gi, '-')
      slug = slug.replace(/\-\-\-/gi, '-')
      slug = slug.replace(/\-\-/gi, '-')
      slug = '@' + slug + '@'
      slug = slug.replace(/\@\-|\-\@|\@/gi, '')
      return slug
    },
  }
}
