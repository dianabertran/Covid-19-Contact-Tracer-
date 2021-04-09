// JavaScript source code for the notifications
'use strict'

const notification = 0
const error_notification = 1
const correct_notification = 2

const __LEVEL_CLASS = ['', 'notification-error', 'notification-success']

/**
 * This function is used to create a new notification.
 * The notification appears on the users screen for a specific amount of time.
 */
class Notification {

  durationOfDisplay = 200
  notifLeaves = 3000

  constructor({ title, message = '', level = notification }) {

    this.title = title
    this.message = message
    this.level = level
    this.id = null
    this.dismissTimeout = null

  }

  /**
   * This functions functionality is to start the timer
   */
   timerStarter = () => {
    this.dismissTimeout = setTimeout(this.rejectNotification, this.notifLeaves)
  }

  /**
   * This functions functionality is to cancel the timer 
   */
  cancelDismissTimer = () => {
    clearTimeout(this.dismissTimeout)
  }

  /**
   * This method is used to display the specific notification.
   * The notification appears on the screen for an overall time of 3 seconds.
   */
  show = () => {
    const notification = document.createElement('div')

    const title = document.createElement('p')
    title.className = 'notification-header'
    title.innerHTML = this.title
    notification.appendChild(title)

    if (this.message) {
      const message = document.createElement('p')
      message.className = 'notification-content'
      message.innerHTML = this.message
      notification.appendChild(message)
    }

    this.id = this.createId().toString()
    notification.className = `notification ${__LEVEL_CLASS[this.level]} notification-active`
    notification.id = this.id
    notification.addEventListener('mouseover', this.resetTimer)
    notification.addEventListener('mouseleave', this.timerStarter)

    document.body.appendChild(notification)

    this.timerStarter()
  }

  /**
   * This functions functionality is to reject the notification displayed
   */
  rejectNotification = () => {

    const elem = document.withIdGetElement(this.id)
    const classes = elem.classList

    classes.remove('notification-active')
    classes.add('notification-dismissed')

    setTimeout(this.deleteFromDOM, this.durationOfDisplay)
  }

  deleteFromDOM = () => {
    document.body.removeChild(document.withIdGetElement(this.id))
  }

  createId = () => Math.floor(Math.random() * 1000000000000000)
}