import FavoreCurrencies from './favoreCurrencies';
import AllCurrencies from './allCurrencies';

const names = {
  a: 'Tabela A kursów średnich walut obcych',
  b: 'Tabela B kursów średnich walut obcych',
  c: 'Tabela C kursów kupna i sprzedaży walut obcych',
};

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
    this.clearALLCurrencies = this.clearALLCurrencies.bind(this);
    this.currentTable = names.a;
  }

  async render() {
    this.createHeader();
    this.createsidebar();
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

  createsidebar() {
    const sidebar = document.createElement('section');
    const allCurrenciesCategory = document.createElement('div');
    const allCurrenciesText = document.createElement('h1');
    const favCurrenciesCategory = document.createElement('div');
    const favCurrenciesText = document.createElement('h1');
    const unfollowAllBtn = document.createElement('button');

    allCurrenciesText.innerText = 'Wszystkie waluty';
    favCurrenciesText.innerText = 'Ulubione waluty';
    unfollowAllBtn.innerText = 'Unfollow All';

    allCurrenciesCategory.appendChild(allCurrenciesText);
    this.allCurrenciesCategory = allCurrenciesCategory;
    allCurrenciesCategory.classList.add('choosen');

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
    if (this.favcur) {
      this.favCurrenciesCategory.classList.remove('choosen');
    }
    await this.rerenderTable();
  }

  async onFavoriteCurrencyButtonClick(e) {
    const favTable = new FavoreCurrencies(this.tableWrapper, this.curentTableIndex);
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
    const title = document.createElement('h1');

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

    pageWrapper.appendChild(wrapper);
    const newTable = new AllCurrencies(this.tableWrapper, this.curentTableIndex);
    await newTable.render();
    pageWrapper.appendChild(this.tableWrapper);

    this.pageBody = pageWrapper;
  }

  async rerenderTable(e) {
    if (e !== undefined) {
      this.curentTableIndex = e.target.closest('button').dataset.id;
    }

    const index = this.curentTableIndex;
    this.currentTable = names[index];
    this.title.innerText = this.currentTable;

    this.tableWrapper.remove();

    if (this.favCurrenciesCategory.classList.contains('choosen')) {
      const newTable = new FavoreCurrencies(this.tableWrapper, this.curentTableIndex);
      await newTable.render();
      this.pageBody.appendChild(this.tableWrapper);
    } else if (this.allCurrenciesCategory.classList.contains('choosen')) {
      const newTable = new AllCurrencies(this.tableWrapper, this.curentTableIndex);
      await newTable.render();
      this.pageBody.appendChild(this.tableWrapper);
      this.favCurrenciesCategory.classList.remove('choosen');
      this.allCurrenciesCategory.classList.add('choosen');
    }
  }
}
