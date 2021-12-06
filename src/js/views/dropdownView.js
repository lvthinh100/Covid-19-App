class dropdownView {
  _parentElement = document.querySelector(".app");

  constructor() {
    this._parentElement.addEventListener("click", function (e) {
      const dropdownBtn = e.target.closest(".dropdown__link");

      if (!dropdownBtn && e.target.closest(".dropdown") != null) return;

      let currentDropdown;
      if (dropdownBtn) {
        currentDropdown = e.target.closest("[data-dropdown]");
        currentDropdown.classList.toggle("active");
      }

      document.querySelectorAll("[data-dropdown]").forEach((dropdown) => {
        if (dropdown === currentDropdown) return;
        dropdown.classList.remove("active");
      });
    });
  }
}

export default new dropdownView();
