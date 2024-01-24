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

  closeAlert('.notification__btn-close', '.notification')

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
  $('.searchable-list')
    .select2({
      // width: '300px',
      placeholder: 'Выберите вариант',
      // maximumSelectionLength: 2,
      language: 'ru',
    })
    .on('select2:opening', function (e) {
      $(this)
        .data('select2')
        .$dropdown.find(':input.select2-search__field')
        .attr('placeholder', 'Поиск...')
    })

  $('.input__substation').on('select2:select', function (event) {
    const idSubstation = event.params.data.id

    $.ajax({
      url: `/substations/show-accession/${idSubstation}`,
      method: 'GET',
      dataType: 'json',
      success: function (options) {
        $('.input__accession').html('')
        $('.input__accession').append(
          '<option value="0" selected disabled>Выберите присоединение</option>'
        )
        options.forEach((option) => {
          $('.input__accession').append(`<option value=${option.id}>${option.name}</option>`)
        })
      },
      error: function (jqXHR) {
        if (jqXHR.status === 0) {
          console.log('Not connect. Verify Network.')
        } else if (jqXHR.status === 404) {
          console.log('Requested page not found (404).')
          $('.input__accession').html('')
          $('.input__accession').append(
            '<option value="0" selected disabled>Произошла ошибка при получении данных с сервера</option>'
          )
        }
      },
    })
  })

  // Print PDF
  $('.btn-save-pdf').on('click', () => {
    $('.save-info-pdf').printThis()
  })
  $('.btn-hide-img').click('click', () => {
    $('.defect-info__imgs').slideToggle(200, function () {
      if ($(this).is(':hidden')) {
        $('.btn-hide-img').html('Показать изображения')
      } else {
        $('.btn-hide-img').html('Скрыть изображения')
      }
    })
    return false
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
            <div class="modal__close">
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

    $('body').on('click', '.modal__close, .overlay', function (event) {
      event.preventDefault()

      $('.overlay, .modal').fadeOut('fast', function () {
        $('.modal__close, .modal, .overlay').remove()
      })
    })
  }

  enlargeImage('.defect-info__img')

  // Hide void rows
  $('.btn_hide_void_rows').click('click', () => {
    $('.no_data_rows').slideToggle(200, function () {
      if ($(this).is(':hidden')) {
        $('.btn_hide_void_rows').html('Показать пустые строки')
      } else {
        $('.btn_hide_void_rows').html('Скрыть пустые строки')
      }
    })
  })

  // Save table excel
  const exportExcel = (btnSelector, tableSelector, filename = 'excel-file') => {
    const btnSave = document.querySelector(btnSelector)
    const table = document.querySelector(tableSelector)

    if (btnSave === null || table === null) return null

    // btnSave.addEventListener('click', () => {
    //   /* Create worksheet from HTML DOM TABLE */
    //   const wb = XLSX.utils.table_to_book(table, { sheet: 'sheet-1' })

    //   /* Export to file (start a download) */
    //   XLSX.writeFile(wb, `${filename}.xls`)
    // })
    btnSave.addEventListener('click', () => {
      const table2excel = new Table2Excel()

      table2excel.export(table, filename)
    })
  }

  exportExcel('.btn-save-excel', '.table', 'Report')
})
