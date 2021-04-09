// JavaScript source code for the utils

/**
 * This function is used for getting a new date and time from each string.
 * @param {String} dateString 
 * @param {String} timeString 
 * @returns New date and time. 
 */
 function getDate(dateString, timeString) {
  const [year, month, date] = dateString.split('-')
  const [hour, minute] = timeString.split(':')

  return new Date(year, month - 1, date, hour, minute, 0, 0)
}

/**
 * Append the given character to the left of the given string until the final string
 * is equal to the given length.
 * @param {String} string 
 * @param {String} char 
 * @param {String} len 
 * @returns {String}
 */
function padding(string, char, len) {

  const stringLength = string.length
  // Checks length of string and adds padding if necessary
  if (stringLength >= len) return string
  const padding = len - stringLength
  return `${char.repeat(padding)}${string}`
}

/**
 * This function is used to get the time in seconds
 * @param {Date} date 
 * @returns unix timestamp 
 */
 function unixTimestamp(date) {
  return Math.floor(date.getTime() / 1000)
}

/**
 * This functions functionality is to check what data is missing from the required fields on the form.
 * Finds the first missing field in a form.
 * @param {FormData} form 
 * @param {object} fields 
 * @returns {String} 
 */
function findMissingData(form, fields) {
  for (const field in fields) {
    if (!form.get(field)) {
      return field
    }
  }
  return null
}

/**
 * This functions functionality is to make sure the date input is correct.
 * @param {Date} date 
 */
function isDateCorrect(date) {
  return !isNaN(date)
}

function dataRequiredInform(form, fields) {
  let field
  do {
    field = findMissingData(form, fields)
    if (field) {
      submittedForm.delete(field)
    }
  } while (field)
}