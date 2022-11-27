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

  const openDropdownMenu = () => {
    const btnTriggers = document.querySelectorAll('.btn-menu')
    const dropdownMenus = document.querySelectorAll('.dropdown-menu')

    if (btnTriggers && dropdownMenus) {
      btnTriggers.forEach((btnTrigger, i) => {
        btnTrigger.addEventListener('click', () => {
          dropdownMenus[i].classList.add('active')
          closeDropdownMenu(dropdownMenus[i])
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

  openDropdownMenu()
})
