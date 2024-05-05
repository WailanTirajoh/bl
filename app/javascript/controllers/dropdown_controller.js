import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["content"];
  static animationDuration = 300;

  connect() {
    const classList = this.contentTarget.classList;
    if (!classList.contains("hidden")) {
      classList.add("hidden");
    }

    document.addEventListener("click", this.hideOnClickOutside);
  }

  disconnect() {
    document.removeEventListener("click", this.hideOnClickOutside);
  }

  toggle(e) {
    e.stopPropagation();
    if (this.contentTarget.classList.contains("hidden")) {
      this.show();
    } else {
      this.hide();
    }
  }

  hideOnClickOutside = (e) => {
    if (
      !this.element.contains(e.target) &&
      !this.contentTarget.classList.contains("hidden")
    ) {
      this.hide();
    }
  };

  hide() {
    this.animateOut();
  }

  show() {
    this.animateIn();
  }

  animateIn() {
    this.contentTarget.classList.add("opacity-0");
    this.contentTarget.classList.remove("hidden");

    // Triggers delay to perform animation
    setTimeout(() => {
      this.contentTarget.classList.add("fade-in");
    }, 10);

    // Transition cleanup
    setTimeout(() => {
      this.contentTarget.classList.remove("opacity-0");
      this.contentTarget.classList.remove("fade-in");
    }, this.constructor.animationDuration);
  }

  animateOut() {
    this.contentTarget.classList.add("fade-out");

    setTimeout(() => {
      this.contentTarget.classList.add("hidden");
      this.contentTarget.classList.remove("fade-out");
    }, this.constructor.animationDuration);
  }
}
