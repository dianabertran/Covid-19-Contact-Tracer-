// JavaScript source code for the requests

const GET = 'GET'
const POST = 'POST'
const DELETE = 'DELETE'

class Request {
  url_server =
    'http://ml-lab-4d78f073-aa49-4f0e-bce2-31e5254052c7.ukwest.cloudapp.azure.com:60500'

  send = () => {
    this.xhr.open(this.method, `${this.url}${this.paramsString()}`)

    if (this.data) {
      this.xhr.setRequestHeader('Content-Type', 'application/json')
      this.xhr.send(JSON.stringify(this.data))
    } else if (this.form) {
      this.xhr.send(this.form)
    } else {
      this.xhr.send()
    }
  }

  constructor({ method, params = {}, data = null, form = null, url }) {
    this.method = method
    this.params = params
    this.data = data
    this.form = form
    this.url = `${this.url_server}${url}/index.php`
    this.xhr = new XMLHttpRequest()
  }
  
  addListener = (listener) => {
    this.xhr.addEventListener('load', listener)
    return this
  }

  paramsString = () =>
    Object.keys(this.params).reduce(
      (str, key, i) => `${str}${i === 0 ? '?' : '&'}${key}=${this.params[key]}`,
      '',
    )
}