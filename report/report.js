// JavaScript source code for the report page.

/**
 * Attribute for the infection report form
 * @type {HTMLFormElement}
 */
const infectionReportForm = document.withIdGetElement('infection-report-form')

/** @type {HTMLButtonElement} */
const cancelButton = document.withIdGetElement('cancel-btn')

/** @type {HTMLButtonElement} */
const reportButton = document.withIdGetElement('report-btn')

/**
 * This function is for disabling/cancelling the report buttons on the page
 * @param {} param0 
 */
function toggleButtons({ disabled }) {
    cancelButton.disabled = disabled
    reportButton.disabled = disabled

}
const DATA = {

    infectionDateTime: 'infectionDateTime',
    infectionDate: 'infection-date',
    infectionTime: 'infection-time',

}

/**
 * Confirms the form submitted by the user
 * @param {FormData} form 
 * @returns {Boolean} This indicates if the form is correct.
 */
function confirmForm(form) {
    const missingData = findMissingData(form)

    if (missingData) {
        toggleButtons({ disabled: false })
        new Notification({

            title: 'Data required has to still be input by the user.',
            message: `Fill in the ${missingData} field please.`,
            level: error_notification,

        }).show()
        return false
    }

    return true
}

/**
 * This functions used when a successful form has been submitted.
 * @param {Event} event 
 */
 function handlingFormConfirmed(event) {
    event.preventDefault()
    toggleButtons({ disabled: true })

    const submittedForm = new FormData(infectionReportForm)
    const isFormCorrect = confirmForm(submittedForm)

    if (isFormCorrect) {
        const infectionTime = submittedForm.get(DATA.infectionTime)
        const infectionDate = submittedForm.get(DATA.infectionDate)
        const infectionDateTime = getDate(infectionDate, infectionTime)
        submittedForm.delete(DATA.infectionDate)
        submittedForm.delete(DATA.infectionTime)
        submittedForm.set(DATA.infectionDateTime, unixTimestamp(infectionDateTime))

        new Request({
            method: POST,
            url: '/infection',
            form: submittedForm,
        })
            .addListener(infectionReportAnswerCaller)
            .send()
    }
}

/**
 * This function is used for making sure the reported covid-19 infection was done so successfully.
 */
function infectionReportAnswerCaller() {
    console.log(this.response)
    switch (this.status) {

        case 200:
            toggleButtons({ disabled: false })
            new Notification({

                title: 'Reported infection correctly!',
                level: correct_notification,
                
            }).show()
            break

        case 500:
            const { error } = JSON.parse(this.response)

            toggleButtons({ disabled: false })
            new Notification({

                title: 'Something went wrong when reporting. Please try again.',
                message: error,
                level: error_notification,

            }).show()
            break

        default:
            break
    }
}

infectionReportForm.addEventListener('submit', handlingFormConfirmed)