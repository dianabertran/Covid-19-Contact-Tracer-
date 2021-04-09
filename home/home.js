// JavaScript source code for the home page.

/** @type {HTMLDivElement} */
const mapContainer = document.withIdGetElement('map-container')

/** @type {HTMLParagraphElement} */
const statusText = document.withIdGetElement('status-text')

/**
 * This function gets the up to date infections.
 */
 function getInfections() {
    new Request({
        method: GET,
        url: '/infection',
    })
        .addListener(infectionRequestAnswerCaller)
        .send()
}

/**
 * This function gets the specific username.
 */
function getUsername() {
    new Request({
        method: GET,
        url: '/username',
    })
        .addListener(updateUsername)
        .send()
}

/**
 * This function is used to update the username.
 */
 function updateUsername() {
    const { username } = JSON.parse(this.response)

    statusText.innerText = `Hi ${username}${statusText.innerText}`
}

/**
 * This function is used when user has been in contact with someone that tested positive.
 */
 function infectionRequestAnswerCaller() {

    switch (this.status) {
        
        case 500:
            const { error } = JSON.parse(this.response)
            new Notification({

                title: 'Unfortunately, there has been an error!',
                message: error,
                level: error_notification,

            }).show()
            break

        case 200:
            console.log(this.response)
            const visits = JSON.parse(this.response)

            let contactExists = false

            for (const visit of visits) {
                if (!contactExists && visit.contacted) {
                    contactExists = true
                }

                const marker = document.createElement('img')

                marker.src = `../static/images/marker_${visit.contacted ? 'red' : 'black'}.webp`
                marker.classList.add('location-marker', 'visit-marker')
                marker.alt = `Marker of visit at x = ${visit.x} and y = ${visit.y}`
                marker.style.top = `${visit.x}px`
                marker.style.left = `${visit.y}px`
                mapContainer.appendChild(marker)
            }

            if (contactExists) {
                statusText.innerText +=
                    'The red marker indicates where you could have been infected by someone that tested positive for covid-19.'
            }

            break

        default:

            break
    }
}

/**
 * This function is used for logging out.
 */
function loggingOut() {
    new Request({
        method: GET,
        url: '/logout',
    }).send()
}

document.addEventListener('DOMContentLoaded', () => {
    getUsername()
    getInfections()
})