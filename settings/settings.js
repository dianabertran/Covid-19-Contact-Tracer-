// JavaScript source code for the settings page.

/**
 * Attribute for the settings form.
 * @type {HTMLFormElement}
 */
const settingsForm = document.withIdGetElement('settings-form')

const DATA = {
  window: 'window',
  distance: 'distance',

}

/**
 * This function is used for confirmation, if settings have been saved appropiately.
 */
function saveSettingsAnswerCaller() {
  switch (this.status) {
    case 200:
      new Notification({

        title: 'Changes to settings have been made correctly.',
        level: correct_notification,

      }).show()
      break

    case 500:
      const { error } = JSON.parse(this.response)
      new Notification({

        title: 'Changes to settings have not been made correctly. Please try again.',
        message: error,
        level: error_notification,
        
      }).show()
      break

    default:
      break
  }
}

/**
 * This function is used once the settings have been submitted/updated.
 * @param {Event} event 
 */
function settingsUpdater(event) {
  event.preventDefault()

  const submittedForm = new FormData(settingsForm)

  dataRequiredInForm(submittedForm)

  new Request({

    method: POST,
    form: submittedForm,
    url: '/settings',
  })
    .addListener(saveSettingsAnswerCaller)
    .send()
}

settingsForm.addEventListener('submit', settingsUpdater)