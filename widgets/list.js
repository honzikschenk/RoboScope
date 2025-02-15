function renderList(container, data) {
  const listElement = document.createElement('ul');

  data.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.timestamp}: ${item.value}`;
    listElement.appendChild(listItem);
  });

  container.appendChild(listElement);
}

module.exports = renderList;
