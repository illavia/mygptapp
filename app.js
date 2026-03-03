const yearEl = document.getElementById("year");
const fillDemoBtn = document.getElementById("fill-demo");

yearEl.textContent = new Date().getFullYear();

fillDemoBtn.addEventListener("click", () => {
  fillDemoBtn.textContent = "Sample profile loaded ✓";
  fillDemoBtn.disabled = true;

  const demo = document.createElement("p");
  demo.innerHTML =
    "<strong>Sample:</strong> Alex Rivera · Product-minded builder · Loves clean UX, rapid prototyping, and practical automation.";
  demo.style.marginTop = "10px";
  fillDemoBtn.parentElement.appendChild(demo);
});
