

async function slowResponse() {
  return new Promise(res => {
    setTimeout(res, 1250)
  })
}

export {
  slowResponse
}
