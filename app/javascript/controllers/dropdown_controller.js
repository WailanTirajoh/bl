import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="dropdown"
export default class extends Controller {
  static targets = ["content"];

  connect() {
    this.hide();
    document.addEventListener("click", this.hide);
  }

  disconnect() {
    document.removeEventListener("click", this.hide);
  }

  toggle(e) {
    e.stopPropagation(); // prevent onclick event on connect to fire
    this.contentTarget.classList.toggle("hidden");
  }

  hide = () => {
    this.contentTarget.classList.add("hidden");
  };
}
