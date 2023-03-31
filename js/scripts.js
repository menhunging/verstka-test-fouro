//
//
//
// ОДИН ФАЙЛ НА ВСЕ ТАСКИ И STYLE.CSS тоже один
//
//
//

$(document).ready(function () {
  if ($(".filterList").length) {
    filter();

    $(".controls .btn").on("click", function () {
      $(".filterList").toggleClass("column-3");
    });
  }

  if ($(".form").length) {
    form();

    $("#emailInput").inputmask({
      mask: "*{3,20}@*{3,20}.*{3,20}",
      clearIncomplete: true,
    });
  }

  if ($(".selectric").length > 0) {
    $(".selectric").selectric();

    $("#selectCompany").on("change", function () {
      $("#selectPosition").attr("disabled", false).selectric("refresh");
      selectCompanyChange();
    });

    $("select").on("change", function () {
      $(this).valid();
    });
  }
});

function filter() {
  const filterItem = $(".filterItem");
  const links = $(".menu a");

  $(".menu a").on("click", function (e) {
    e.preventDefault();
    let link = $(this);
    let filter = link.attr("data-filter");

    links.removeClass("active");
    link.addClass("active");

    filterItem.hasClass("hide") && filterItem.removeClass("hide");

    if (filter === "all") {
      filterItem.removeClass("hide");
      return false;
    }

    filterItem.map(function () {
      if ($(this).attr("data-filter") !== filter) {
        $(this).addClass("hide");
      }
    });
  });
}

function form() {
  let form = $(".form");
  let inputs = $(".form").find("input");
  let tbody = $(".table .tbody");
  let tr = "";
  let td = `<div class='td' data-mobile-title='ID'>${
    $(".table .tbody .tr").length + 1
  }</div>`;

  form.validate({
    ignore: [],
    errorPlacement: function (error, element) {
      var data = element.data("selectric");
      error.appendTo(
        data
          ? element.closest("." + data.classes.wrapper).parent()
          : element.parent()
      );
    },
    rules: {
      firstName: {
        required: true,
      },
      lastName: {
        required: true,
      },
      company: {
        required: true,
      },
      position: {
        required: true,
      },
    },
    messages: {
      firstName: {
        required: "*Поле обязательно для заполнения",
      },
      lastName: {
        required: "*Поле обязательно для заполнения",
      },
      company: {
        required: "*Обязательно нужно выбрать компанию",
      },
      position: {
        required: "*Обязательно нужно выбрать должность",
      },
    },
  });

  form.submit(function (e) {
    if (form.valid()) {
      e.preventDefault();
      let data = $(this).serializeArray();
      let titleMobile = "";

      $.each(data, function () {
        switch (this.name) {
          case "firstName":
            titleMobile = "Имя";
            break;
          case "lastName":
            titleMobile = "Фамилия";
            break;
          case "email":
            titleMobile = "Email";
            break;
          case "company":
            titleMobile = "Компания";
            break;
          case "position":
            titleMobile = "Должность";
            break;
        }

        if (this.name === "email" && this.value === "") {
          td =
            td +
            `<div class='td' data-mobile-title='${titleMobile}'>Email не указан</div>`;
        } else {
          td =
            td +
            `<div class='td' data-mobile-title='${titleMobile}'>${this.value}</div>`;
        }
      });

      tr = `<div class='tr'>${td}</div>`;
      tbody.append(tr);

      // clear form
      tr = "";
      td = `<div class='td' data-mobile-title='ID'>
                ${$(".table .tbody .tr").length + 1}</div>`;
      inputs.val("");
      $(".selectric").map(function () {
        $(this).selectric("destroy");
        $(this).prop("selectedIndex", 0).selectric("refresh");
      });
      $("#selectPosition").attr("disabled", true).selectric("refresh");
      // /clear form
    }
  });
}

function selectCompanyChange() {
  let selectCompany = document.getElementById("selectCompany");
  let selectPosition = document.getElementById("selectPosition");

  for (let i = 0; i < selectPosition.childNodes.length; i++) {
    let cur = selectPosition.childNodes.item(i);

    if (cur.nodeName.toLowerCase() == "optgroup") {
      let parent = $("#" + cur.id)
        .parents(".selectric-wrapper")
        .find(`.${cur.id}`)
        .parents(".selectric-group");

      cur.label.toLowerCase() == selectCompany.value.toLowerCase()
        ? parent.css("display", "block")
        : parent.css("display", "none");
    }
  }
}
