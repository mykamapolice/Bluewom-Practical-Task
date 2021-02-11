const TABLE = {
  A: 'a',
  B: 'b',
  C: 'c',
};

export default class Page {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.header = null;
    this.sidebar = null;
    this.pageBody = null;
    // eslint-disable-next-line prefer-destructuring
    this.table = TABLE.A;
    this.currenies = null;
  }

  async render() {
    this.createHeader();
    this.createsidebar();
    await this.getCurrency();
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

    const buttonsWrapper = document.createElement('div');
    const btnA = document.createElement('button');
    const btnB = document.createElement('button');
    const btnC = document.createElement('button');

    buttonsWrapper.append(btnA, btnB, btnC);

    btnA.innerText = 'tabela A';
    btnB.innerText = 'tabela B';
    btnC.innerText = 'tabela C';

    pageWrapper.appendChild(buttonsWrapper);
    pageWrapper.appendChild(this.table);

    this.pageBody = pageWrapper;
  }

  createTable() {
    const tableWrapper = document.createElement('div');
    const table = document.createElement('table');
    const trHeader = document.createElement('tr');
    const thCurrency = document.createElement('th');
    const thCode = document.createElement('th');
    const thRate = document.createElement('th');
    const thFollow = document.createElement('th');

    thCurrency.innerText = 'Currency';
    thCode.innerText = 'Code';
    thRate.innerText = 'Middle currency rate';
    thFollow.innerText = 'Follow';

    tableWrapper.classList.add('table-wrapper');
    table.classList.add('pageBody__currency-table');
    trHeader.append(thCurrency, thCode, thRate, thFollow);
    table.appendChild(trHeader);

    const { rates } = this.currenies[0];

    rates.forEach((item) => {
      const trCell = document.createElement('tr');
      const trCurrency = document.createElement('td');
      const trCode = document.createElement('td');
      const trRate = document.createElement('td');
      const trFollow = document.createElement('td');
      const followBtn = document.createElement('button');

      trCurrency.innerText = item.currency;
      trCode.innerText = item.code;
      trRate.innerText = item.mid;
      followBtn.innerText = 'Follow';
      trFollow.appendChild(followBtn);

      trCell.append(trCurrency, trCode, trRate, trFollow);
      console.log(trCell);
      table.appendChild(trCell);
    });

    tableWrapper.appendChild(table);

    this.table = tableWrapper;
  }

  async getCurrency() {
    try {
      const response = await fetch('http://api.nbp.pl/api/exchangerates/tables/a/');
      const currencies = await response.json();
      currencies.forEach((el) => {
        console.log(el);
      });
      this.currenies = currencies;
    } catch (e) {
      throw new Error(e);
    }
  }
}
