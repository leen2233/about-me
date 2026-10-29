// Editor chrome behaviour: mobile sidebar drawer + folder expand/collapse.
// ~1 KB, no dependencies.

(function () {
  var body = document.body;

  var hamburger = document.querySelector('.hamburger');
  var backdrop = document.getElementById('backdrop');

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      body.classList.toggle('sidebar-open');
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', close);
  }

  function close() {
    body.classList.remove('sidebar-open');
  }

  // Close the mobile drawer when navigating to a file.
  document.querySelectorAll('.tree-row.file').forEach(function (link) {
    link.addEventListener('click', close);
  });

  // Expand/collapse folders.
  document.querySelectorAll('.tree-row.folder').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var folder = btn.parentElement;
      var closed = folder.classList.toggle('closed');
      btn.setAttribute('aria-expanded', String(!closed));
    });
  });
})();
