const form = document.querySelector("#addReview")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("input[type='submit']");
      updateBtn.removeAttribute("disabled")
    })