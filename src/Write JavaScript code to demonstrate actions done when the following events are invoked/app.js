// ─── i. CLICK EVENT ───────────────────────────────────────

const myBtn = document.getElementById('myBtn');
let clickCount = 0;

myBtn.addEventListener('click', function(event) {
  clickCount++;

  const output = document.getElementById('click-output');
  output.textContent = `Button clicked ${clickCount} time(s)!`;

  console.log('--- Click Event Fired ---');
  console.log('Element clicked:', event.target);
  console.log('Click position  X:', event.clientX, ' Y:', event.clientY);
  console.log('Total clicks so far:', clickCount);
});


// ─── ii. SUBMIT EVENT ─────────────────────────────────────

const myForm = document.getElementById('myForm');

myForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const name  = document.getElementById('nameInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  const output = document.getElementById('submit-output');

  if (!name || !email) {
    output.textContent = 'Please fill in both fields.';
    output.classList.add('error');
    console.warn('Submit blocked — empty fields detected');
    return;
  }

  output.textContent = `Submitted! Name: "${name}" | Email: "${email}"`;
  output.classList.remove('error');

  console.log('--- Submit Event Fired ---');
  console.log('Name submitted:', name);
  console.log('Email submitted:', email);

  myForm.reset();
});