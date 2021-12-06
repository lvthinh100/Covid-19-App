import icons from "url:../../img/icons.svg";

export default class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderDot(dotDiv = this._parentElement) {
    const html = `
    <div class="dot-container">
      <div class="dot dot1">
        <svg>
          <use href="${icons}#virus-dot"></use>
        </svg>
      </div>
      <div class="dot dot2">
        <svg>
          <use href="${icons}#virus-dot"></use>
        </svg>
      </div>
      <div class="dot dot3">
        <svg>
          <use href="${icons}#virus-dot"></use>
        </svg>
      </div>
    </div>
      `;
    dotDiv.innerHTML = "";
    dotDiv.insertAdjacentHTML("afterbegin", html);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
  renderError(message = this._errorMessage) {
    console.log("Hello");
    const markup = `
      <div class="message">
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  renderMessage(message = this._message, messageDiv = false) {
    const markup = `
          <div class="message">
            <p>${message}</p>
            <div>
              <svg>
                <use href="${icons}#icon-error"></use>
              </svg>
            </div>
          </div>
        `;
    if (messageDiv) {
      this._messageDiv.innerHTML = "";
      this._messageDiv.insertAdjacentHTML("afterbegin", markup);
      return;
    }
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
