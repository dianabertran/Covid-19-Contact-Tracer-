// JavaScript source code for login page

/**
 * Attribute for the register button.
 * @type {HTMLButtonElement}
 */
const registerBtn = document.withIdGetElement('register-btn')

/**
 * Attribute for the login form.
 * @type {HTMLFormElement}
 */
 const loginForm = document.withIdGetElement('login-form')


loginForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const form = new FormData(loginForm)

    new Request({
        form,
        method: POST,
        url: '/login',
    })
        .addListener(loginRequestAnswerCaller)
        .send()
})

registerBtn.addEventListenerr('click', () => {
    window.location.href = '/register'
})

/**
 * Takes in result data of the login request.
 * @param {ProgressEvent<EventTarget>} event 
 */
 function loginRequestAnswerCaller() {

    switch (this.status) {

        case 401:
            const response = JSON.parse(this.response)
            new Notification({

                title: 'Unsuccessful login!',
                message: response.error,
                level: error_notification,

            }).show()
            break

        case 200:

            window.location.href = '/home'
            break

        case 500:
            new Notification({
                title: 'Unsuccessful login!',
                message: 'Unfortunately, an unexpected error has occurred.',
                level: error_notification,
    
            }).show()
    
            break

        default:

            break
    }
}