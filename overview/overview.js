// JavaScript source code for overview page

/**
 * Attribute to the table where the recent visited locations are displayed for user.
 * @type {HTMLTableElement}
 */
 const locationTable = document.withIdGetElement('location-table')

 /**
 * @type {HTMLParagraphElement}
 */
const noRecordLabel = document.withIdGetElement('no-record-label')

/**
 * This functions is used when updating or adding the new infectious locations.
 */
function locationsRequestAnswerCaller() {

    console.log(this.response)
    const locations = JSON.parse(this.response)

    if (locations.length <= 0) {
        noRecordLabel.classList.remove('hidden')
        locationTable.classList.add('hidden')
    } else {
        clearTable()

        for (const location of locations) {

            const { id, visited_on_timestamp, duration, location_x, location_y } = location
            const date = new Date(visited_on_timestamp * 1000)
            const yearStr = padding(date.getFullYear().toString(), '0', 4)
            const monthStr = padding((date.getMonth() + 1).toString(), '0', 2)
            const hourStr = padding(date.getHours().toString(), '0', 2)
            const minStr = padding(date.getMinutes().toString(), '0', 2)
            const dateStr = padding(date.getDate().toString(), '0', 2)
            const timeFormatted = `${hourStr}:${minStr}`
            const dateFormatted = `${dateStr}/${monthStr}/${yearStr}`
            const deleteButton = document.createElement('img')
            deleteButton.src = '../static/images/cross.webp'
            deleteButton.classList.add('delete-button')
            deleteButton.addEventListener('click', visitRemoval(id))
            const row = locationTable.insertRow()

            row.insertCell().innerText = dateFormatted
            row.insertCell().innerText = timeFormatted
            row.insertCell().innerText = duration
            row.insertCell().innerText = location_x
            row.insertCell().innerText = location_y
            row.insertCell().appendChild(deleteButton)
        }
        locationTable.classList.remove('hidden')
    }
}

/**
 * This function is used to remove visits.
 */
function deleteVisitAnswerCaller() {

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
            new Notification({

                title: 'Visit was removed successfully!',
                level: correct_notification,

            }).show()
            locationGetter()
            break

        default:
            break
    }
}

/**
 * This function is used to get the locations.
 */
function locationGetter() {
    new Request({
        method: GET,
        url: '/location',
    })
        .addListener(locationsRequestAnswerCaller)
        .send()
}

function visitRemoval(id) {
    return () => {

        new Request({
            method: DELETE,
            url: '/location',
            params: { id },
        })
            .addListener(deleteVisitAnswerCaller)
            .send()
    }
}

/**
 * This function is used to clear the whole table with recent infections.
 */
 function clearTable() {
    
    let rowCount = locationTable.rows.length
    while (rowCount > 1) {
        locationTable.deleteRow(rowCount-- - 1)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    locationGetter()
})