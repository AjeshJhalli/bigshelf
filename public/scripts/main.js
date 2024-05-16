function showSaveAndCancelButtons(buttonClass) {
  for (const element of document.getElementsByClassName(buttonClass)) {
    element.classList.remove('hidden');
  }
}