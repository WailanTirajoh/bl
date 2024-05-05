import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="collapse"
export default class extends Controller {
  static targets = ["content", "icon"];

  toggle() {
    this.contentTarget.classList.toggle("hidden");
  }

  hide = () => {
    this.contentTarget.classList.add("hidden");
  };
}
