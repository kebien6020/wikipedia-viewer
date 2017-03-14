export const getWithCancel = (url, token) => { // the token is for cancellation
  return new Promise(function(resolve, reject) {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200)
        resolve(xhttp.responseText)
    }
    xhttp.onerror = reject
    xhttp.open('GET', url, true)

    token.cancel = function() {  // SPECIFY CANCELLATION
      xhttp.abort() // abort request
      reject('cancelled') // reject the promise
    }

    xhttp.send()
  })
}

// Use like this
// const singleRequest = last(getWithCancel)
// singleRequest('a.json') // this will get cancelled
// singleRequest('b.json')
export const last = fn => {
  const lastToken = { cancel: () => {} } // start with no op
  return function() {
    lastToken.cancel()
    const args = Array.prototype.slice.call(arguments)
    args.push(lastToken)
    return fn.apply(this, args)
  }
}
