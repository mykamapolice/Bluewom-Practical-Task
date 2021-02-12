import FavoreCurrencies from './favoreCurrencies';
import AllCurrencies from './allCurrencies';

export default class Page {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.header = null;
    this.sidebar = null;
    this.pageBody = null;
    this.table = null;
    this.currenies = null;
    this.curentTableIndex = 'a';
    this.onAllCurrenciesButtonClick = this.onAllCurrenciesButtonClick.bind(this);
    this.onFavoriteCurrencyButtonClick = this.onFavoriteCurrencyButtonClick.bind(this);
    this.rerenderTable = this.rerenderTable.bind(this);
  }

  async render() {
    this.createHeader();
    this.createsidebar();
    await this.createPageBody();

    this.rootElement.appendChild(this.header);
    this.rootElement.appendChild(this.sidebar);
    console.log(this.pageBody);
    await this.rootElement.appendChild(this.pageBody);
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

    allCurrenciesCategory.addEventListener('click', this.onAllCurrenciesButtonClick);

    favCurrenciesCategory.addEventListener('click', this.onFavoriteCurrencyButtonClick);

    sidebar.append(allCurrenciesCategory, favCurrenciesCategory);
    sidebar.classList.add('sidebar');

    this.sidebar = sidebar;
  }

  onAllCurrenciesButtonClick(e) {
    this.rerenderTable();
    this.allCur = e.target.closest('div');
    this.allCur.classList.add('choosen');
    this.favcur.classList.remove('choosen');
  }

  async onFavoriteCurrencyButtonClick(e) {
    const favTable = new FavoreCurrencies(this.tableWrapper, this.curentTableIndex);
    await favTable.render();
    this.favTable = favTable.table;
    this.favcur = e.target.closest('div');
    this.favcur.classList.add('choosen');
    this.allCur.classList.remove('choosen');
  }

  async createPageBody() {
    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add('table-wrapper');
    this.tableWrapper = tableWrapper;
    const pageWrapper = document.createElement('section');
    pageWrapper.classList.add('pageBody');

    const buttonsWrapper = document.createElement('div');
    const btnA = document.createElement('button');
    const btnB = document.createElement('button');
    const btnC = document.createElement('button');

    btnA.innerText = 'tabela A';
    btnA.dataset.id = 'a';
    btnB.innerText = 'tabela B';
    btnB.dataset.id = 'b';
    btnC.innerText = 'tabela C';
    btnC.dataset.id = 'c';
    buttonsWrapper.classList.add('buttons');

    buttonsWrapper.append(btnA, btnB, btnC);
    buttonsWrapper.addEventListener('click', this.rerenderTable);

    pageWrapper.appendChild(buttonsWrapper);
    const newTable = new AllCurrencies(this.tableWrapper, this.curentTableIndex);
    await newTable.render();
    pageWrapper.appendChild(this.tableWrapper);

    this.pageBody = pageWrapper;
  }

  async rerenderTable(e) {
    if (e !== undefined) {
      this.curentTableIndex = e.target.closest('button').dataset.id;
    }
    this.tableWrapper.remove();
    const newTable = new AllCurrencies(this.tableWrapper, this.curentTableIndex);
    await newTable.render();
    this.pageBody.appendChild(this.tableWrapper);
  }
}
