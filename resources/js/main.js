document.addEventListener('DOMContentLoaded', () => {
  // Open dialog

  const openDialog = (selectorDialog, selectorBtnTrigger) => {
    const dialog = document.querySelector(selectorDialog)
    const btnTrigger = document.querySelector(selectorBtnTrigger)

    btnTrigger.addEventListener('click', () => {
      dialog.classList.toggle('active')
    })
  }

  openDialog('.dialog', '.btn-open')

  // Alerts
  const closeBtn = document.querySelector('.alert__btn-close')
  const message = document.querySelector('.alert')

  closeBtn.addEventListener('click', () => {
    message.classList.toggle('active')
  })
})
