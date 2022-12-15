document.addEventListener('DOMContentLoaded', () => {
  // Open dialog

  // const openDialog = (selectorDialog, selectorBtnTrigger) => {
  //   const dialog = document.querySelector(selectorDialog)
  //   const btnTrigger = document.querySelector(selectorBtnTrigger)

  //   if (btnTrigger && dialog) {
  //     btnTrigger.addEventListener('click', () => {
  //       dialog.classList.toggle('active')
  //     })
  //   }
  // }

  // openDialog('.dialog', '.btn-open')

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

  // Dropdown menu

  const openDropdownMenu = (btnSelector, dropdownSelector) => {
    const btnTrigger = document.querySelectorAll(btnSelector)
    const dropdownContent = document.querySelectorAll(dropdownSelector)

    if (btnTrigger && dropdownContent) {
      btnTrigger.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          dropdownContent[i].classList.toggle('active')
          dropdownContent.forEach((item, j) => (i !== j ? item.classList.remove('active') : null))
          closeDropdownMenu(dropdownContent[i])
        })
      })
    }

    const closeDropdownMenu = (dropdownItem) => {
      window.addEventListener('click', (e) => {
        const target = e.target

        if (!target.closest('.btn-menu') && !target.closest('.dropdown-menu')) {
          if (dropdownItem.classList.contains('active')) {
            dropdownItem.classList.toggle('active')
          }
        }
      })
    }
  }

  openDropdownMenu('.btn-menu', '.dropdown__menu')
})
