export default class Page {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.header = null;
    this.sidebar = null;
    this.pageBody = null;
    this.table = null;
    this.currenies = null;
    this.curentTableIndex = 'a';
    this.updateTable = this.updateTable.bind(this);
  }

  async render() {
    this.createHeader();
    this.createsidebar();
    await this.createTable();
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

    buttonsWrapper.append(btnA, btnB, btnC);
    buttonsWrapper.addEventListener('click', this.updateTable);

    pageWrapper.appendChild(buttonsWrapper);
    pageWrapper.appendChild(this.table);

    this.pageBody = pageWrapper;
  }

  updateTable(e) {
    this.curentTableIndex = e.target.closest('button').dataset.id;
    this.pageBody.remove();
    this.createTable();
    this.createPageBody();
    this.rootElement.appendChild(this.pageBody);
  }

  async createTable() {
    const tableWrapper = document.createElement('div');
    const table = document.createElement('table');
    const trHeader = document.createElement('tr');
    const thCurrency = document.createElement('th');
    const thCode = document.createElement('th');
    const thFollow = document.createElement('th');

    thCode.innerText = 'Code';
    thCurrency.innerText = 'Currency';
    thFollow.innerText = 'Follow';

    tableWrapper.classList.add('table-wrapper');
    table.classList.add('pageBody__currency-table');

    if (this.curentTableIndex === 'c') {
      const bid = document.createElement('th');
      const ask = document.createElement('th');

      bid.innerText = 'bid';
      ask.innerText = 'ask';

      trHeader.append(thCurrency, thCode, bid, ask, thFollow);
    } else {
      const thRate = document.createElement('th');
      thRate.innerText = 'Middle currency rate';
      trHeader.append(thCurrency, thCode, thRate, thFollow);
    }

    table.appendChild(trHeader);

    const currencies = await this.getCurrency();

    const { rates } = currencies[0];

    rates.forEach((item) => {
      const trCell = document.createElement('tr');
      const trCurrency = document.createElement('td');
      const trCode = document.createElement('td');
      const trFollow = document.createElement('td');
      const followBtn = document.createElement('button');

      followBtn.addEventListener('click', this.addCurrencyToFavoriteList);

      trCurrency.innerText = item.currency;
      trCode.innerText = item.code;
      followBtn.innerText = 'Follow';
      trFollow.appendChild(followBtn);

      if (this.curentTableIndex === 'c') {
        const trBid = document.createElement('td');
        const trAsk = document.createElement('td');

        trBid.innerText = item.bid;
        trAsk.innerText = item.ask;

        trCell.append(trCurrency, trCode, trBid, trAsk, trFollow);
      } else {
        const trRate = document.createElement('td');
        trRate.innerText = item.mid;
        trCell.append(trCurrency, trCode, trRate, trFollow);
      }

      table.appendChild(trCell);
    });

    tableWrapper.appendChild(table);

    this.table = tableWrapper;
  }

  addCurrencyToFavoriteList() {
    // localStorage.setItem(`Table-${this.curentTableIndex}`, JSON.stringify(this.currenies));
    // const a = JSON.parse(localStorage.getItem(`Table-${this.curentTableIndex}`));
    console.log(this.curentTableIndex);
  }

  async getCurrency() {
    const url = `http://api.nbp.pl/api/exchangerates/tables/${this.curentTableIndex}`;
    try {
      const response = await fetch(url);
      const currencies = await response.json();
      this.currenies = currencies[0].rates;
      return currencies;
    } catch (e) {
      throw new Error(e);
    }
  }
}
