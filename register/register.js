// JavaScript source code for register page.

/**
 * Represents all fields required for registring.
 */
const DATA = {

    name: 'name',
    surname: 'surname',
    username: 'username',
    password: 'password',
}

/**
 * Attributes for the registration form.
 * @type {HTMLFormElement}
 */
const registrationForm = document.withIdGetElement('registration-form')

/** @type {HTMLButtonElement} */
const submitButton = document.getElementsByClassName('register-btn')[0]

// Makes sure password being input by user has a length of minimum 8 charcaters.
const MIN_PASSWORD_LENGTH = 8

/**
 * This function is used for submitting the registration form.
 * @param {Event} event
 */
 function handlingFormConfirmed(event) {
    event.preventDefault()

    submitButton.disabled = true

    const submittedForm = new FormData(registrationForm)
    const isFormCorrect = confirmForm(submittedForm)

    if (isFormCorrect) {
        new Request({
            method: POST,
            url: '/register',
            form: submittedForm,
        })
            .addListener(registrationRequestAnswerCaller)
            .send()
    }
}

/**
 * Confirms the values needed for registring.
 * @param {FormData} form The form that needs to be confirmed
 * @returns {boolean} If form is confirmed, TRUE is obtained, else, FALSE.
 */
function confirmForm(form) {
    // makes sure all inputs needed have been input succesffully.
    const missingData = findMissingData(form, DATA)
    // if missing field present notification displayed
    if (missingData) {
        submitButton.disabled = false
        new Notification({

            title: 'Required field has not been input yet!',
            message: `User has to fill in the ${missingData} field part.`,
            level: error_notification,

        }).show()
        return false;
    }

    const password = form.get(DATA.password)
    // if the password input is not strong enough, notification alerting this also is displayed.
    if (
        password.length < MIN_PASSWORD_LENGTH ||
        // the password created has to have at least one digit, one lower case letter and one uppercase letter.
        !(/[A-Z]/g.test(password) && /[a-z]/g.test(password) && /[0-9]/g.test(password))
    ) {
        submitButton.disabled = false
        new Notification({

            title: 'Password is not strong enough!',
            message:
                'Your password has to contain at least one digit, one lowercase letter and one uppercase letter',
            level: error_notification,

        }).show()
        return false
    }

    return true
}

function registrationRequestAnswerCaller() {
    switch (this.status) {

        case 409:
            submitButton.disabled = false
            new Notification({

                title: 'Username input already exists.',
                message: 'Please input different username.',
                level: error_notification,
            }).show()
            break

        case 500:
            submitButton.disabled = false
            new Notification({

                title: 'Unfortunately, an error has occurred during registration.',
                message: 'Please try again.',
                level: error_notification,
            })
            break

        case 200:
            window.location.href = '/home'
            break

        default:
            submitButton.disabled = false
            break
    }
}

registrationForm.addEventListener('submit', handlingFormConfirmed)