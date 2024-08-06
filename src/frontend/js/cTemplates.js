export function loadTemplate(urlTemplate) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          document.querySelector('main').innerHTML = xhr.responseText
          resolve()
        }
      }
    }
    xhr.open('GET', urlTemplate, true)
    xhr.send()
  })
}