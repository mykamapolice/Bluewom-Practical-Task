import FavoreCurrencies from './favoreCurrencies';
import AllCurrencies from './allCurrencies';

const NAMES = {
  a: 'Tabela A kursów średnich walut obcych',
  b: 'Tabela B kursów średnich walut obcych',
  c: 'Tabela C kursów kupna i sprzedaży walut obcych',
};

const TABS = {
  ALL: 'ALL',
  FAV: 'FAV',
};

export default class Page {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.header = null;
    this.sidebar = null;
    this.pageBody = null;
    this.curentTableIndex = 'a';
    this.currenies = null;
    this.onAllCurrenciesButtonClick = this.onAllCurrenciesButtonClick.bind(this);
    this.onFavoriteCurrencyButtonClick = this.onFavoriteCurrencyButtonClick.bind(this);
    this.rerenderTable = this.rerenderTable.bind(this);
    this.clearALLCurrencies = this.clearALLCurrencies.bind(this);
    this.currentTable = NAMES.a;
    this.currentTab = TABS.ALL;
  }

  async render() {
    this.createHeader();
    this.createSidebar();
    await this.getCurrency();
    await this.createPageBody();

    this.rootElement.appendChild(this.header);
    this.rootElement.appendChild(this.sidebar);
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

  createSidebar() {
    const sidebar = document.createElement('section');
    const allCurrenciesCategory = document.createElement('div');
    const allCurrenciesText = document.createElement('h2');
    const favCurrenciesCategory = document.createElement('div');
    const favCurrenciesText = document.createElement('h2');
    const unfollowAllBtn = document.createElement('button');

    allCurrenciesText.innerText = 'Wszystkie waluty';
    favCurrenciesText.innerText = 'Ulubione waluty';
    favCurrenciesCategory.classList.add('sidebar-categories');
    allCurrenciesCategory.classList.add('sidebar-categories');
    unfollowAllBtn.innerText = 'Usuń wszystkie';

    allCurrenciesCategory.appendChild(allCurrenciesText);
    this.allCurrenciesCategory = allCurrenciesCategory;

    const currentTab = localStorage.getItem('Tab');
    if (currentTab === 'FAV') {
      favCurrenciesCategory.classList.add('choosen');
    } else {
      allCurrenciesCategory.classList.add('choosen');
    }

    favCurrenciesCategory.appendChild(favCurrenciesText);
    this.favCurrenciesCategory = favCurrenciesCategory;
    favCurrenciesCategory.appendChild(unfollowAllBtn);

    allCurrenciesCategory.addEventListener('click', this.onAllCurrenciesButtonClick);

    favCurrenciesText.addEventListener('click', this.onFavoriteCurrencyButtonClick);

    unfollowAllBtn.addEventListener('click', this.clearALLCurrencies);

    sidebar.append(allCurrenciesCategory, favCurrenciesCategory);
    sidebar.classList.add('sidebar');

    this.sidebar = sidebar;
  }

  clearALLCurrencies(e) {
    localStorage.clear();
    this.onFavoriteCurrencyButtonClick(e);
  }

  async onAllCurrenciesButtonClick(e) {
    this.allCur = e.target.closest('div');
    this.allCurrenciesCategory.classList.add('choosen');
    this.favCurrenciesCategory.classList.remove('choosen');
    await this.rerenderTable();
  }

  async onFavoriteCurrencyButtonClick(e) {
    const favTable = new FavoreCurrencies(this.tableWrapper, this.curentTableIndex, this.currenies);
    this.currentTab = TABS.FAV;
    this.saveCurrentTab();
    await favTable.render();
    this.favTable = favTable.table;
    this.favcur = e.target.closest('div');
    this.favCurrenciesCategory.classList.add('choosen');
    this.allCurrenciesCategory.classList.remove('choosen');
  }

  async createPageBody() {
    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add('table-wrapper');
    this.tableWrapper = tableWrapper;
    const pageWrapper = document.createElement('section');
    pageWrapper.classList.add('pageBody');

    const wrapper = document.createElement('div');
    wrapper.classList.add('table-header');
    const buttonsWrapper = document.createElement('div');
    const titleWrapper = document.createElement('div');
    const title = document.createElement('h2');

    this.title = title;
    this.title.innerText = this.currentTable;
    titleWrapper.appendChild(title);

    const btnA = document.createElement('button');
    const btnB = document.createElement('button');
    const btnC = document.createElement('button');

    btnA.innerText = 'Tabela A';
    btnA.dataset.id = 'a';
    btnB.innerText = 'Tabela B';
    btnB.dataset.id = 'b';
    btnC.innerText = 'Tabela C';
    btnC.dataset.id = 'c';
    buttonsWrapper.classList.add('buttons');

    buttonsWrapper.append(btnA, btnB, btnC);
    buttonsWrapper.addEventListener('click', this.rerenderTable);
    titleWrapper.appendChild(title);
    wrapper.append(buttonsWrapper, titleWrapper);
    const currentTab = localStorage.getItem('Tab');
    if (currentTab !== null) {
      this.currentTab = currentTab;
    }

    pageWrapper.appendChild(wrapper);
    if (this.currentTab === TABS.ALL) {
      const newTable = new AllCurrencies(this.tableWrapper,
        this.curentTableIndex, this.currenies);
      await newTable.render();
    } else if (this.currentTab === TABS.FAV) {
      const newTable = new FavoreCurrencies(this.tableWrapper,
        this.curentTableIndex, this.currenies);
      await newTable.render();
      this.allCurrenciesCategory.classList.remove('choosen');
      this.favCurrenciesCategory.classList.add('choosen');
    }
    pageWrapper.appendChild(this.tableWrapper);

    this.pageBody = pageWrapper;
  }

  async rerenderTable(e) {
    if (e !== undefined && e !== null) {
      this.curentTableIndex = e.target.closest('button').dataset.id;
    }

    const index = this.curentTableIndex;
    this.currentTable = NAMES[index];
    this.title.innerText = this.currentTable;

    await this.getCurrency();
    this.tableWrapper.remove();

    if (this.favCurrenciesCategory.classList.contains('choosen')) {
      const newTable = new FavoreCurrencies(this.tableWrapper,
        this.curentTableIndex, this.currenies);
      await newTable.render();
      this.pageBody.appendChild(this.tableWrapper);
    } else if (this.allCurrenciesCategory.classList.contains('choosen')) {
      const newTable = new AllCurrencies(this.tableWrapper,
        this.curentTableIndex, this.currenies);
      this.currentTab = TABS.ALL;
      localStorage.setItem('Tab', this.currentTab);
      await newTable.render();

      this.pageBody.appendChild(this.tableWrapper);
      this.favCurrenciesCategory.classList.remove('choosen');
      this.allCurrenciesCategory.classList.add('choosen');
    }
  }

  saveCurrentTab() {
    localStorage.setItem('Tab', this.currentTab);
  }

  async getCurrency() {
    const url = `http://api.nbp.pl/api/exchangerates/tables/${this.curentTableIndex}`;

    try {
      const response = await fetch(url);
      const currencies = await response.json();

      this.currenies = currencies[0].rates;
    } catch (e) {
      throw new Error(e);
    }
  }
}
