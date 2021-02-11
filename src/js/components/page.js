export default class Page {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.header = null;
    this.sidebar = null;
    this.pageBody = null;
  }

  render() {
    this.createHeader();
    this.createsidebar();
    this.createTable();
    this.createPageBody();

    this.rootElement.appendChild(this.header);
    this.rootElement.appendChild(this.sidebar);
    this.rootElement.appendChild(this.pageBody);
  }

  createHeader() {
    const header = document.createElement('header');
    const headerTitle = document.createElement('h1');

    headerTitle.innerText = 'Bluewom Practical Assignment';
    header.classList.add('header');

    header.appendChild(headerTitle);

    this.header = header;
  }

  createsidebar() {
    const sidebar = document.createElement('section');
    const allCurrenciesCategory = document.createElement('div');
    const allCurrenciesText = document.createElement('h1');
    const favCurrenciesCategory = document.createElement('div');
    const favCurrenciesText = document.createElement('h1');

    allCurrenciesText.innerText = 'Wszystkie waluty';
    favCurrenciesText.innerText = 'Ulubione waluty';

    allCurrenciesCategory.appendChild(allCurrenciesText);
    favCurrenciesCategory.appendChild(favCurrenciesText);

    allCurrenciesCategory.addEventListener('click', () => {
      console.log('Wszystkie waluty');
    });

    favCurrenciesCategory.addEventListener('click', () => {
      console.log('Ulubione waluty');
    });

    sidebar.append(allCurrenciesCategory, favCurrenciesCategory);
    sidebar.classList.add('sidebar');

    this.sidebar = sidebar;
  }

  createPageBody() {
    const pageWrapper = document.createElement('section');
    pageWrapper.classList.add('pageBody');

    pageWrapper.appendChild(this.table);

    this.pageBody = pageWrapper;
  }

  createTable() {
    const table = document.createElement('table');
    const trHeader = document.createElement('tr');
    const thCureency = document.createElement('th');
    const thCode = document.createElement('th');
    const thRate = document.createElement('th');
    const thFollow = document.createElement('th');

    thCureency.innerText = 'Currency';
    thCode.innerText = 'Code';
    thRate.innerText = 'Middle currency rate';
    thFollow.innerText = 'Follow';

    table.classList.add('pageBody__currency-table');

    trHeader.append(thCureency, thCode, thRate, thFollow);
    table.appendChild(trHeader);

    this.table = table;
  }
}
