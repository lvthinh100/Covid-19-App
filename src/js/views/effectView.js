class UI {
  _nav = document.querySelector(".header__nav");
  _allSection = document.querySelectorAll(".section");
  _currSection = this._allSection[0];
  _allBtn = document.querySelectorAll(".header__nav .link");
  _obsSection = new IntersectionObserver(
    this._activeItemCurrentSection.bind(this),
    {
      root: null,
      threshold: 0,
      rootMargin: `${-window.innerHeight / 2 + 50}px`,
    }
  );
  constructor() {
    // this._nav.addEventListener("click", this._smoothScroll);
    this._allSection.forEach((section) => this._obsSection.observe(section));
  }

  //   _smoothScroll(e) {
  //     console.log(e.target);
  //     const btn = e.target.closest(".link");
  //     console.log(btn);
  //     if (!btn) return;
  //     console.log(btn.getAttribute("href"));
  //     const section = document.querySelector(`${btn.getAttribute("href")}`);
  //     console.log(section);
  //     section.scrollIntoView({ behavior: "smooth" });
  //   }
  _activeNavItem(section) {
    const item = document.querySelector(`[href="#${section.id}"]`);
    this._allBtn.forEach((btn) => btn.classList.remove("active"));
    item.classList.add("active");
  }
  _activeItemCurrentSection(entries) {
    const [entry] = entries;
    if (entry.isIntersecting) {
      this._currSection = entry.target;
      this._activeNavItem(this._currSection);
    }
  }
}

export default new UI();
