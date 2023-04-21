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

        if (!target.closest('.btn-dropdown') && !target.closest('.dropdown-menu')) {
          if (dropdownItem.classList.contains('active')) {
            dropdownItem.classList.toggle('active')
          }
        }
      })
    }
  }

  openDropdownMenu('.btn-dropdown', '.dropdown__menu')

  // Searchable list
  $('.searchable-list').select2({
    width: '350px',
    placeholder: 'Выберите вариант',
    maximumSelectionLength: 2,
    language: 'ru',
  })

  // Print PDF
  $('.btn-save-pdf').on('click', () => {
    $('.defect-info').printThis()
  })

  // Upload file
  const changeFile = (inputSelector, textSelector) => {
    const inputFile = document.querySelector(inputSelector)
    const fieldText = document.querySelector(textSelector)
    let fileList

    if (!inputFile || !fieldText) return

    inputFile.addEventListener('change', () => {
      fileList = []

      for (let i = 0; i < inputFile.files.length; i++) {
        fileList.push(inputFile.files[i])
      }

      uploadFile(fileList, fieldText)
    })
  }

  const uploadFile = (file, field) => {
    if (file && file.length > 1) {
      if (file.length <= 4) {
        field.textContent = `Выбрано ${file.length} файла`
      }
      if (file.length > 4) {
        field.textContent = `Выбрано ${file.length} файлов`
      }
    } else {
      field.textContent = file[0].name.substring(0, 20)
    }
  }

  changeFile('.form__file-input', '.text-file-input')

  // Image enlargement
  const enlargeImage = (selectorImg) => {
    if (!selectorImg) return

    const img = document.querySelectorAll(selectorImg)

    $(img).click(function () {
      // console.log('click')
      const imgPath = $(this).attr('src')

      $('body').append(
        `
          <div class="overlay"></div>
          <div class="modal">
            <img src="${imgPath}"/>
            <div class="close-modal">
              <i>&times;</i>
            </div>
          </div>
        `
      )
      $('.modal').css({
        left: ($(document).width() - $('.modal').outerWidth()) / 2,
        top: ($(window).height() - $('.modal').outerHeight()) / 2,
      })
      $('.overlay, .modal').fadeIn('fast')
    })

    $('body').on('click', '.close-modal, .overlay', function (event) {
      event.preventDefault()

      $('.overlay, .modal').fadeOut('fast', function () {
        $('.close-modal, .modal, .overlay').remove()
      })
    })
  }

  enlargeImage('.defect-info__img')
})
