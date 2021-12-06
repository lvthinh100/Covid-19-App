class modalView {
  _parentElement = document.querySelector(".app");
  constructor() {
    this._parentElement.addEventListener("click", function (e) {
      const btnShow = e.target.closest("[data-show]");
      if (!btnShow) return;
      const modal = document.querySelector(
        `[data-modal="${btnShow.dataset.show}"]`
      );
      modal.classList.toggle("hidden");
    });
  }
}

export default new modalView();
