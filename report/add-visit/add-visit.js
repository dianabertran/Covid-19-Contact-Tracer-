// JavaScript source code for add-visit page.

/**
 * Identifiers thare are not reassigned involving the following:
 * data/time/duration/visitDate/locationX/locationY
 */
 const DATA = {
    date: 'date',
    time: 'time',
    duration: 'duration',
    visitDate: 'visitDate',
    locationX: 'x',
    locationY: 'y',
}

/**
 * Tuple is used to store the coordinates given by the user that represent the selected area on the map.
 * @type {number[]}
 */
 let visitLocation = null

/**
 * Attribute for the form that allows users to add new visits.
 * @type {HTMLFormElement}
 */
 const addVisitForm = document.withIdGetElement('add-visit-form')

 /** 
 * Attribute to add a button for adding visits.
 * @type {HTMLButtonElement} */
const addVisitButton = document.withIdGetElement('add-visit-btn')

/** 
 * Attribute to cancel the button for adding visits.
 * @type {HTMLButtonElement} */
const cancelButton = document.withIdGetElement('cancel-add-visit-btn')

/**
 * Attribute for the location map on the page.
 * @type {HTMLImageElement}
 */
const mapLocation = document.withIdGetElement('location-map')

/**
 * Attribute for the specific location on the map marked with a marker. 
 * @type {HTMLImageElement}
 */
const markingLoc = document.withIdGetElement('location-marker')


/**
 * This function is used for disabling/canceling add visits and add visit buttons
 * @param {*} param0 
 */
function toggleButtons({ disabled }) {

    cancelButton.disabled = disabled
    addVisitButton.disabled = disabled
}

/**
 * This function sets the coordinates of the visit.
 * The function is called when interacting with map (clicking).
 * @param {MouseEvent} event 
 */
function locationCoordinateSetter(event) {
    const position = event.currentTarget.getClientRect()
    const parentPos = mapLocation.parentElement.getClientRect()
    const x = event.clientX - position.left
    const y = event.clientY - position.top
    markingLoc.classList.remove('hidden')
    markingLoc.style.left = `${x - 8 + position.left - parentPos.left}px`
    markingLoc.style.top = `${y - 16}px`
    visitLocation = [x, y]
}

    /**
    * Checks what fields require more data input.
    * Alerts user of what is missing and where.
    */
     const { visitDate, locationX, locationY, ...requiredData } = DATA
     const missingData = findMissingData(form, requiredData)
 
     console.log(missingData)
 
     if (missingData) {
 
         toggleButtons({ disabled: false })
         new Notification({
 
             title: 'Missing required field!',
             message: `You must fill in the ${missingData} field.`,
             level: error_notification,
 
         }).show()
         return false
     }

/**
 * This function is used to confirm the form from user.
 * @param {FormData} form Submission made by user. 
 * @returns {Boolean} Two possible outcomes (Is the form valid).
 */
function confirmForm(form) {
    if (visitLocation == null) {
        toggleButtons({ disabled: false })
        new Notification({

            title: 'You must pick a location on the map!',
            message: 'Click on the map to choose the location you have visited',
            level: error_notification,

        }).show()
        return false
    }

    /** 
     * Gets the date and times from data for further use.
     * @type {String} 
     * */
    const dateStringConfirmed = form.get(DATA.date)
    const dateStringConfirmed = form.get(DATA.time)
    const [year, month, date] = dateStringConfirmed.split('-')
    const [hour, minute] = dateStringConfirmed.split(':')

    const submittedDate = new Date(year, month - 1, date, hour, minute, 0, 0)

    console.log({ submittedDate })

    if (!isDateCorrect(submittedDate)) {
        toggleButtons({ disabled: false })
        new Notification({

            title: 'Incorrect date input!',
            message: 'Please check date and time input is correct.',
            level: error_notification,

        }).show()
        return false
    }

    if (submittedDate > new Date()) {
        toggleButtons({ disabled: false })
        new Notification({

            title: 'Visit date input has to be in the past!',
            message: 'The date of visit was input in future however should be past.',
            level: error_notification,

        }).show()
        return false
    }

    form.delete(DATA.time)
    form.delete(DATA.date)
 
    /**
     * JavaScript source code returns the timestamp submitted in milliseconds.
     * Therefore, divide by 1000.
     */
    form.set(DATA.visitDate, Math.floor(submittedDate.getTime() / 1000))
    const [x, y] = visitLocation
    form.set(DATA.locationX, x)
    form.set(DATA.locationY, y)

    return true
}

/**
 * This function is used to add the visit requests from results received.
 */
function addVisitRequestAnswerCallers() {
    console.log(this.response)
    toggleButtons({ disabled: false })

    switch (this.status) {

        case 200:
            new Notification({

                title: 'Add-visit data recorded correctly!',
                message: 'Proceed to register more visits in the future.',
                level: correct_notification,

            }).show()
            
            addVisitForm.reset()
            break

        default:
            break

        case 500:
            new Notification({
    
                title: 'Error occurred while adding visit data!',
                message: 'Please try again.',
                level: error_notification,
    
            }).show()
            break
    }
}

/**
 * This function is called when a form has been submitted.
 * @param {Event} event 
 */
 function handlingFormConfirmed(event) {
    event.preventDefault()
    toggleButtons({ disabled: true })

    const formConfirmed = new FormData(addVisitForm)
    const isFormCorrect = confirmForm(formConfirmed)

    console.log(isFormCorrect)

    if (isFormCorrect) {

        new Request({
            method: POST,
            url: '/location',
            form: formConfirmed,
        })
            .addListener(addVisitRequestAnswerCallers)
            .send()
    }
}

mapLocation.addEventListener('click', locationCoordinateSetter)
addVisitForm.addEventListener('submit', handlingFormConfirmed)