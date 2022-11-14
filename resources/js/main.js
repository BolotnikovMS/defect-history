document.addEventListener('DOMContentLoaded', () => {
  // Open dialog

  const openDialog = (selectorDialog, selectorBtnTrigger) => {
    const dialog = document.querySelector(selectorDialog)
    const btnTrigger = document.querySelector(selectorBtnTrigger)

    if (btnTrigger && dialog) {
      btnTrigger.addEventListener('click', () => {
        dialog.classList.toggle('active')
      })
    }
  }

  openDialog('.dialog', '.btn-open')

  // Alerts

  const closeAlert = (closeBtnSelector, alertSelector) => {
    const closeBtn = document.querySelector(closeBtnSelector)
    const message = document.querySelector(alertSelector)

    if (closeBtn && message) {
      closeBtn.addEventListener('click', () => {
        message.classList.toggle('active')
        message.remove()
      })

      setTimeout(() => {
        message.classList.toggle('active')
        message.remove()
      }, 3000)
    }
  }

  closeAlert('.alert__btn-close', '.alert')
})
